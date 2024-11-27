// Modules to control application life and create native browser window
const { app, BrowserWindow,ipcMain,dialog } = require('electron')

const DataStore = require('./renderer/MusicDataStore')
const myStore = new DataStore({'name': 'MusicData'});


class AppWindow extends BrowserWindow {
  constructor(config,fileLocation) {
    const basicConfig = {
      width:800,
      height:600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    }
    // const finalConfig = Object.assign(basicConfig,config)
    const finalConfig =  {...basicConfig, ...config}
    super(finalConfig)
    this.loadFile(fileLocation)
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}
app.on('ready',() => {
  const mainWindow = new AppWindow({},'./renderer/index.html')
  // mainWindow.openDevTools() // 开启浏览器控制台
  mainWindow.webContents.on('did-finish-load',() => {
    mainWindow.send('getTracks', myStore.getTracks())
  })
  ipcMain.on('add-music-window', () => {
    const addWindow = new AppWindow({
      width:500,
      height:400,
      parent:mainWindow
    },'./renderer/add.html')    
    // addWindow.loadFile('./renderer/add.html')
  })
  ipcMain.on('add-tracks',(event,tracks) => {
    console.log(tracks);
    const updateTracks = myStore.addTracks(tracks).getTracks()
    console.log(updateTracks);
    mainWindow.send('getTracks',updateTracks)
    
  })
  ipcMain.on('delete-track', (event,id) => {
    const updateTracks = myStore.deleteTrack(id).getTracks()
    mainWindow.send('getTracks',updateTracks)
  })
  ipcMain.on('open-music-file',(event) => {
    dialog.showOpenDialog({
      properties: ['openFile','multiSelections'],
      filters: [{name: 'Music', extensions: ['mp3']}]
    }).then(result => { 
      if (!result.canceled) { 
        // console.log(result.filePaths); 
        event.sender.send('selected-file',result.filePaths)
      } else { 
        console.log('No file selected'); 
      } 
    })
  })
})
