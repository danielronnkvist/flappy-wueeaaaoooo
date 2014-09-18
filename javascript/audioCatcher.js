var AudioContext = window.AudioContext || window.webkitAudioContext;
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
navigator.getUserMedia = navigator.getUserMedia       ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia    ||
                         navigator.msGetUserMedia;


function liveInput()
{
  if(getUserMedia)
  {
    getUserMedia({audio:true}, getStream, error);
  }
  else
  {
    error("No getUserMedia")
  }
}

function getStream(stream)
{

}

function error(e)
{
  console.error("Error", e)
}
