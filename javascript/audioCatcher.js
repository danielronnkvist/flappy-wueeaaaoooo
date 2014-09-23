var AudioContext = window.AudioContext || window.webkitAudioContext;

window.requestAnimFrame =
          window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback )
          {
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

  // Add filter
  // First a bandpassfilter for catching all frequencies a human can produce
  // Then boost the more common with a peaking- or bandpass-filter

  // Good bandpass values might be from 150 to 4000
  //

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

// Polynomial interpolation
// a is the values of on the outgoing x-axis
// x is measured x-values
// f is measured function-values
function interpolate(a,x,f)
{
  // l is outgoing y values
  var l = []
  var aux = 0;
  var temp = 1;
  for(var k = 0; k < a.length; k++)
  {
    for(var i = 0; i < x.length; i++)
    {
      for(var j = 0; j < x.length; j++)
      {
        if(i != j)
        {
            temp *= (a[k]-x[j])/(x[i]-x[j])
        }
      }
      aux += f[i]*temp;
      temp = 1;
    }
    l.push(aux);
    aux = 0;
  }
  return l;
}
