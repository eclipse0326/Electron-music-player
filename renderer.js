/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
const { ipcRenderer } = require('electron')
 
// alert(process.versions.node)

window.addEventListener('DOMContentLoaded',() => {
  // alert('greeting from the DOM side')
  ipcRenderer.send('message','hello from renderer')
  ipcRenderer.on('reply',(event,arg) =>{
    document.getElementById('message').innerHTML=arg;
  })
})