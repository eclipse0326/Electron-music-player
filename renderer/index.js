const {ipcRenderer} = require('electron')
const {$, convertDuration} = require('./helper')
let musicAudio = new Audio()
let allTracks
let currentTrack

$('add-music-button').addEventListener('click',()=> {
  ipcRenderer.send('add-music-window')
})

const renderListHTML = (tracks) => {
  const tracksList = $('tracksList')
  const tracksListHTML = tracks.reduce((html,track) => {
    html += `<li class="row music-track list-group-item d-flex justify-content-between align-item-ceter">
                <div class="col-10">
                  <i class="fa fa-music mr-2"></i>
                  <b>${track.fileName}</b>
                </div>
                <div class="col-1">
                  <i class="fa fa-play mr-3" data-id="${track.id}"></i>
                </div>
                <div class="col-1">
                  <i class="fa fa-trash" data-id="${track.id}"></i>
                </div>
              </li>`
    return html
  },'')
  const emptyTrackHTML = '<div class="alert alert-primary">还没有添加音乐</div>'
  tracksList.innerHTML = tracks.length ? `<ul class="list-group">${tracksListHTML}</ul>` : emptyTrackHTML
}
const renderPlayHTML = (name,duration) => {
  const player = $('player-status')
  const html = `<div class="col font-weight-bold">
                  正在播放: ${name}
                </div>
                <div class="col">
                  <span id="current-seeker">00:00</span> / ${convertDuration(duration)}
                </div>`
  player.innerHTML = html                
}
const updateProgressHTML = (currentTime,duration) => {
  const progress = Math.floor(currentTime / duration *100)
  const bar = $('player-progress')
  bar.innerHTML = progress + '%'
  bar.style.width = progress + '%'
  const seeker = $('current-seeker')
  seeker.innerHTML = convertDuration(currentTime)
}
ipcRenderer.on('getTracks',(event,tracks) =>{
  allTracks = tracks
  renderListHTML(tracks)
})
musicAudio.addEventListener('loadedmetadata', () => {
  renderPlayHTML(currentTrack.fileName,musicAudio.duration)
})
musicAudio.addEventListener('timeupdate', () => {
  updateProgressHTML(musicAudio.currentTime,musicAudio.duration)
})
$('tracksList').addEventListener('click', (event) => {
  event.preventDefault()
  const {dataset,classList} = event.target
  const id = dataset && dataset.id
   
  if(id && classList.contains('fa-play')){
    if (currentTrack && currentTrack.id ===id) {
      //继续播放音乐
      musicAudio.play()
    } else {
      // 播放新的音乐
      currentTrack = allTracks.find(track => track.id ===id)
      musicAudio.src = currentTrack.path
      musicAudio.play()
      const resetIconEle = document.querySelector('.fa-pause')
      if(resetIconEle) {
        resetIconEle.classList.replace('fa-pause','fa-play')
      }
    }
    
    classList.replace('fa-play','fa-pause')
  } else if (id && classList.contains('fa-pause')){
    musicAudio.pause()
    classList.replace('fa-pause','fa-play')
  } else if (id && classList.contains('fa-trash')){
    ipcRenderer.send('delete-track',id)
  }
})