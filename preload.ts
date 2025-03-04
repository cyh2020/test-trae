const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
})

contextBridge.exposeInMainWorld('fileOps', {
  openFile: () => ipcRenderer.invoke('open-file-dialog'),
  saveFile: (content, currentFilePath) => ipcRenderer.invoke('save-file-dialog', { content, currentFilePath }),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath)
})

contextBridge.exposeInMainWorld('shell', {
  openExternal: (url) => ipcRenderer.invoke('open-external-link', url)
})