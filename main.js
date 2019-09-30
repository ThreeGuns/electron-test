const {app, BrowserWindow, ipcMain} = require('electron');
// import {app, BrowserWindow, ipcMain} from 'electron';
let mainWindow;
let pickerDialog;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        height: 500,
        width: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.webContents.openDevTools();

    pickerDialog = new BrowserWindow({
        parent: mainWindow,
        skipTaskbar: true,
        modal: true,
        show: false,
        height: 390,
        width: 680
    });
    mainWindow.loadURL('file://'+__dirname+'/test/index.html');
    pickerDialog.loadURL('file://' + __dirname + '/test/picker.html')
});
ipcMain.on('show-picker', (event, options) => {
    pickerDialog.show()
    pickerDialog.webContents.send('get-sources', options)
});

ipcMain.on('source-id-selected', (event, sourceId) => {
    pickerDialog.hide()
    mainWindow.webContents.send('source-id-selected', sourceId)
});


// const {app, BrowserWindow, Menu, protocol, ipcMain, dialog, desktopCapturer} = require('electron');
// let win;
//
// let template = [], updateMenu;
//
// function createDefaultWindow() {
//     win = new BrowserWindow();
//     win.webContents.openDevTools();
//     win.on('closed', () => {
//         win = null;
//     });
//     win.loadURL(`file://${__dirname}/index.html`);
//     win.on('focus', () => {
//         // win.setProgressBar(1);
//     });
//     win.on('blur', () => {
//         win.setProgressBar(0);
//     });
//     win.setProgressBar(0.5);
//     //win.setOverlayIcon('./ico.ico', 'this is a ico');
//     return win;
// }
//
// app.on('ready', function () {
//     if (process.platform === 'darwin') {
//         // OS X
//         const name = app.getName();
//         template.unshift({
//             label: name,
//             submenu: [
//                 {
//                     label: 'About ' + name,
//                     role: 'about'
//                 },
//                 {
//                     label: 'Quit',
//                     accelerator: 'Command+Q',
//                     click() {
//                         app.quit();
//                     }
//                 },
//             ]
//         })
//     }
//     createDefaultWindow();
//     const menu = Menu.buildFromTemplate(template);
//     Menu.setApplicationMenu(menu);
//     //页面加载完毕之后再操作
//     win.webContents.on('did-finish-load', () => {
//
//     });
//
//     desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
//         for (const source of sources) {
//             if (source.name === 'Electron') {
//                 try {
//                     const stream = await navigator.mediaDevices.getUserMedia({
//                         audio: false,
//                         video: {
//                             mandatory: {
//                                 chromeMediaSource: 'desktop',
//                                 chromeMediaSourceId: source.id,
//                                 minWidth: 1280,
//                                 maxWidth: 1280,
//                                 minHeight: 720,
//                                 maxHeight: 720
//                             }
//                         }
//                     })
//                     handleStream(stream)
//                 } catch (e) {
//                     handleError(e)
//                 }
//                 return
//             }
//         }
//     })
//
//     function handleStream (stream) {
//         const video = document.querySelector('video')
//         video.srcObject = stream
//         video.onloadedmetadata = (e) => video.play()
//     }
//
//     function handleError (e) {
//         console.log(e)
//     }
//
// });
// app.on('window-all-closed', () => {
//     app.quit();
// });
//
