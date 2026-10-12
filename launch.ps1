param(
    [string]$AppPath,
    [string]$AppDir
)

$ErrorActionPreference = "Stop"

$projectDir = (Resolve-Path -LiteralPath $PSScriptRoot).Path
if ([string]::IsNullOrWhiteSpace($AppDir)) {
    $AppDir = $projectDir
} else {
    $AppDir = (Resolve-Path -LiteralPath $AppDir -ErrorAction Stop).Path
}

if (-not (Test-Path -LiteralPath $AppDir -PathType Container)) {
    throw "La carpeta de PokeTokenBar no existe: $AppDir"
}

if ([string]::IsNullOrWhiteSpace($AppPath)) {
    $AppPath = Join-Path $AppDir "node_modules\electron\dist\electron.exe"
} else {
    if (-not [IO.Path]::IsPathRooted($AppPath)) {
        $AppPath = Join-Path $AppDir $AppPath
    }
    $candidate = Resolve-Path -LiteralPath $AppPath -ErrorAction Stop
    $AppPath = $candidate.Path
}

if (-not (Test-Path -LiteralPath $AppPath -PathType Leaf) -or
    [IO.Path]::GetFileName($AppPath) -ine "electron.exe") {
    throw "AppPath debe apuntar al ejecutable electron.exe, no a un script o código JavaScript: $AppPath"
}

$mainScript = Join-Path $AppDir "src\main.js"
if (-not (Test-Path -LiteralPath $mainScript -PathType Leaf)) {
    throw "No se encontró el punto de entrada de PokeTokenBar: $mainScript"
}

Add-Type @'
using System;
using System.Runtime.InteropServices;

public class Win32Launcher {
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct STARTUPINFO {
        public Int32 cb;
        public string lpReserved;
        public string lpDesktop;
        public string lpTitle;
        public Int32 dwX;
        public Int32 dwY;
        public Int32 dwXSize;
        public Int32 dwYSize;
        public Int32 dwXCountChars;
        public Int32 dwYCountChars;
        public Int32 dwFillAttribute;
        public Int32 dwFlags;
        public Int16 wShowWindow;
        public Int16 cbReserved2;
        public IntPtr lpReserved2;
        public IntPtr hStdInput;
        public IntPtr hStdOutput;
        public IntPtr hStdError;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct PROCESS_INFORMATION {
        public IntPtr hProcess;
        public IntPtr hThread;
        public Int32 dwProcessId;
        public Int32 dwThreadId;
    }

    [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    public static extern bool CreateProcess(
        string lpApplicationName,
        string lpCommandLine,
        IntPtr lpProcessAttributes,
        IntPtr lpThreadAttributes,
        bool bInheritHandles,
        uint dwCreationFlags,
        IntPtr lpEnvironment,
        string lpCurrentDirectory,
        ref STARTUPINFO lpStartupInfo,
        out PROCESS_INFORMATION lpProcessInformation
    );

    public static int Launch(string exe, string dir) {
        STARTUPINFO si = new STARTUPINFO();
        si.cb = Marshal.SizeOf(si);
        si.lpDesktop = @"WinSta0\Default";
        PROCESS_INFORMATION pi = new PROCESS_INFORMATION();
        
        string cmd = "\"" + exe + "\" \"" + dir + "\" --poketokenbar-app=PokeTokenBar-Windows";
        // 0x01000000 = CREATE_BREAKAWAY_FROM_JOB, 0x00000200 = CREATE_NEW_PROCESS_GROUP, 0x00000008 = DETACHED_PROCESS
        uint flags = 0x01000208;
        bool ok = CreateProcess(null, cmd, IntPtr.Zero, IntPtr.Zero, false, flags, IntPtr.Zero, dir, ref si, out pi);
        if (!ok) {
            // If breakaway fails due to permissions, try standard creation
            ok = CreateProcess(null, cmd, IntPtr.Zero, IntPtr.Zero, false, 0x00000208, IntPtr.Zero, dir, ref si, out pi);
            if (!ok) {
                return -Marshal.GetLastWin32Error();
            }
        }
        return pi.dwProcessId;
    }
}
'@

$procId = [Win32Launcher]::Launch($AppPath, $AppDir)

if ($procId -gt 0) {
    Write-Output "SUCCESS: Launched on WinSta0\Default with PID $procId"
} else {
    Write-Output "ERROR: Failed to launch, Win32 code: $procId"
}
