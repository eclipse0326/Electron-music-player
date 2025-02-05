exports.$ = (id) => {
  return document.getElementById(id)
} 

exports.convertDuration = (time) => {
  const minutes = "0" + Math.floor(time / 60)
  const seconds = "0" + Math.floor(time - minutes*60)
  return minutes.slice(-2) + ":" + seconds.slice(-2)
}