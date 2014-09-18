var AudioContext = window.AudioContext || window.webkitAudioContext;
window.requestAnimFrame =
          window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
navigator.getUserMedia = navigator.getUserMedia       ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia    ||
                         navigator.msGetUserMedia;

var audioContext = new AudioContext();
var canvas = document.getElementById('canvas');
var analyser = null;


function liveInput()
{
  if(navigator.getUserMedia)
  {
    navigator.getUserMedia({audio:true}, getStream, error);
  }
  else
  {
    error("No getUserMedia")
  }
}

function getStream(stream)
{
  var mediaStream = audioContext.createMediaStreamSource(stream);

  // Create analyser
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  mediaStream.connect(analyser);

  startAnalasys()
}

function startAnalasys()
{
  var buffer = new Uint8Array(this.analyser.frequencyBinCount);
  analyser.getByteTimeDomainData(buffer);

  var correlation = correlate(buffer, audioContext.sampleRate);

  // get that pitch shit to make som game magic
}

function correlate(buffer, sampleRate)
{
  // get some pitch shit
}

function error(e)
{
  console.error("Error", e)
}
liveInput()
