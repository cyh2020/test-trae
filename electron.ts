// electron.ts
const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs').promises;
let isDev = true;

(async () => {
  const electronIsDev = await import('electron-is-dev');
  isDev = electronIsDev.default;
})();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.ts')
    }
  });

  const startURL = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, 'dist/index.html')}`;

  mainWindow.loadURL(startURL);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('open-external-link', async (event, url) => {
  await shell.openExternal(url);
});

// 处理打开文件对话框的请求
ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Markdown', extensions: ['md'] }]
  });
  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const content = await fs.readFile(filePath, 'utf-8');
    return { filePath, content };
  }
  return null;
});

// 处理保存文件对话框的请求
ipcMain.handle('save-file-dialog', async (event, { content, currentFilePath }) => {
  let filePath = currentFilePath;
  if (!filePath) {
    const result = await dialog.showSaveDialog(mainWindow, {
      filters: [{ name: 'Markdown', extensions: ['md'] }]
    });
    if (result.canceled) return null;
    filePath = result.filePath;
  }
  await fs.writeFile(filePath, content, 'utf-8');
  return filePath;
});

// 处理读取文件的请求
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return { content };
  } catch (error) {
    console.error('读取文件失败:', error);
    return null;
  }
});