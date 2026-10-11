const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('vsApi', {
    fightInteractive: () => ipcRenderer.send('action-walker-vs-fight'),
    timeoutBackground: () => ipcRenderer.send('action-walker-vs-timeout'),
    confirm: () => ipcRenderer.send('action-walker-vs-fight'),
    flee: () => ipcRenderer.send('action-walker-vs-flee')
});
