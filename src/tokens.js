const sqlite3 = require('better-sqlite3');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Minimal Protobuf wire decoder
function decodeVarint(buffer, offset) {
    let res = 0n;
    let shift = 0n;
    let pos = offset;
    while (pos < buffer.length) {
        const b = BigInt(buffer[pos++]);
        res |= (b & 0x7Fn) << shift;
        if ((b & 0x80n) === 0n) return [res, pos];
        shift += 7n;
        if (shift > 63n) return null;
    }
    return null;
}

function walkFields(buffer, onField) {
    let pos = 0;
    while (pos < buffer.length) {
        const v = decodeVarint(buffer, pos);
        if (!v) break;
        const [key, afterKey] = v;
        pos = afterKey;
        const field = Number(key >> 3n);
        const wireType = Number(key & 7n);
        if (field <= 0) break;

        if (wireType === 0) {
            const val = decodeVarint(buffer, pos);
            if (!val) break;
            pos = val[1];
            if (onField(field, Number(val[0]), null) === false) return;
        } else if (wireType === 1) {
            pos += 8;
        } else if (wireType === 2) {
            const len = decodeVarint(buffer, pos);
            if (!len) break;
            const length = Number(len[0]);
            pos = len[1];
            if (pos + length > buffer.length) break;
            const slice = buffer.subarray(pos, pos + length);
            pos += length;
            if (onField(field, 0, slice) === false) return;
        } else if (wireType === 5) {
            pos += 4;
        } else {
            break;
        }
    }
}

function getFieldPayload(buffer, targetField) {
    let result = null;
    walkFields(buffer, (field, _val, payload) => {
        if (field === targetField && payload) {
            result = payload;
            return false;
        }
    });
    return result;
}

function getFieldVarint(buffer, targetField) {
    let result = null;
    walkFields(buffer, (field, val, payload) => {
        if (field === targetField && !payload) {
            result = val;
            return false;
        }
    });
    return result;
}

function getFieldString(buffer, targetField) {
    const payload = getFieldPayload(buffer, targetField);
    return payload ? payload.toString('utf8') : null;
}

function parseTimestamp(buffer) {
    if (!buffer) return null;
    const seconds = getFieldVarint(buffer, 1);
    if (!seconds) return null;
    return new Date(seconds * 1000);
}

function parseGenMetadata(buf) {
    const chatModel = getFieldPayload(buf, 1);
    if (!chatModel) return null;
    const usage = getFieldPayload(chatModel, 4);
    if (!usage) return null;

    const inputTokens = getFieldVarint(usage, 2) || 0;
    const outputTokens = getFieldVarint(usage, 3) || 0;
    const cacheRead = getFieldVarint(usage, 5) || 0;
    const responseId = getFieldString(usage, 11) || '';
    const model = getFieldString(chatModel, 19) || 'unknown';

    return {
        input: inputTokens,
        output: outputTokens,
        cacheRead,
        total: inputTokens + outputTokens + cacheRead,
        responseId,
        model
    };
}

class TokenScanner {
    constructor() {
        this.cache = new Map(); // dbPath -> { mtime, size, totalTokens, todayTokens, dateStr }
        this.roots = [
            path.join(os.homedir(), '.gemini', 'antigravity-ide', 'conversations'),
            path.join(os.homedir(), '.gemini', 'antigravity', 'conversations'),
            path.join(os.homedir(), '.gemini', 'antigravity-cli', 'conversations')
        ];
    }

    scan() {
        const todayStr = new Date().toISOString().split('T')[0];
        let totalTokens = 0;
        let todayTokens = 0;
        let totalCalls = 0;
        let todayCalls = 0;
        const scanErrors = [];

        for (const dir of this.roots) {
            if (!fs.existsSync(dir)) continue;
            let files = [];
            try {
                files = fs.readdirSync(dir).filter(f => f.endsWith('.db'));
            } catch (e) {
                scanErrors.push(e);
                continue;
            }

            for (const file of files) {
                const dbPath = path.join(dir, file);
                try {
                    const stat = fs.statSync(dbPath);
                    const cached = this.cache.get(dbPath);

                    if (cached && cached.mtime === stat.mtimeMs && cached.size === stat.size) {
                        totalTokens += cached.totalTokens;
                        totalCalls += cached.totalCalls;
                        // Only add today's if cache date is today
                        if (cached.todayDate === todayStr) {
                            todayTokens += cached.todayTokens;
                            todayCalls += cached.todayCalls;
                        }
                        continue;
                    }

                    // Read DB
                    const db = new sqlite3(dbPath, { readonly: true });
                    const stepDates = {};
                    try {
                        const steps = db.prepare("SELECT metadata FROM steps WHERE metadata IS NOT NULL").all();
                        for (const s of steps) {
                            const date = parseTimestamp(getFieldPayload(s.metadata, 8)) || parseTimestamp(getFieldPayload(s.metadata, 1));
                            if (date) {
                                const chatModel = getFieldPayload(s.metadata, 9);
                                if (chatModel) {
                                    const respId = getFieldString(chatModel, 11);
                                    if (respId) stepDates[respId] = date;
                                }
                            }
                        }
                    } catch (e) {}

                    let dbTotalTokens = 0;
                    let dbTodayTokens = 0;
                    let dbTotalCalls = 0;
                    let dbTodayCalls = 0;

                    const rows = db.prepare("SELECT idx, data FROM gen_metadata WHERE data IS NOT NULL").all();
                    for (const row of rows) {
                        const parsed = parseGenMetadata(row.data);
                        if (parsed && parsed.total > 0) {
                            const date = (parsed.responseId && stepDates[parsed.responseId]) ? stepDates[parsed.responseId] : stat.mtime;
                            const dateStr = date.toISOString().split('T')[0];
                            
                            dbTotalTokens += parsed.total;
                            dbTotalCalls++;
                            if (dateStr === todayStr) {
                                dbTodayTokens += parsed.total;
                                dbTodayCalls++;
                            }
                        }
                    }
                    db.close();

                    this.cache.set(dbPath, {
                        mtime: stat.mtimeMs,
                        size: stat.size,
                        totalTokens: dbTotalTokens,
                        todayTokens: dbTodayTokens,
                        totalCalls: dbTotalCalls,
                        todayCalls: dbTodayCalls,
                        todayDate: todayStr
                    });

                    totalTokens += dbTotalTokens;
                    todayTokens += dbTodayTokens;
                    totalCalls += dbTotalCalls;
                    todayCalls += dbTodayCalls;
                } catch (e) {
                    scanErrors.push(e);
                }
            }
        }

        const hasScanError = scanErrors.length > 0;

        return {
            totalTokens: hasScanError ? null : totalTokens,
            todayTokens: hasScanError ? null : todayTokens,
            totalCalls: hasScanError ? null : totalCalls,
            todayCalls: hasScanError ? null : todayCalls,
            scannerError: hasScanError,
            error: hasScanError ? scanErrors[0].message : null,
            errorCount: scanErrors.length,
            timestamp: Date.now()
        };
    }
}

module.exports = { TokenScanner };
