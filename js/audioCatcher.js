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
var trace = []
var y_value = 0;

function liveInput()
{
  if(navigator.getUserMedia)
  {
    navigator.getUserMedia({audio:true}, getStream, error);
  }
  else
  {
    error("No getUserMedia");
  }
}

function getStream(stream)
{
  var mediaStream = audioContext.createMediaStreamSource(stream);

  // Create analyser
  var filter = audioContext.createBiquadFilter();
  filter.type = filter.bandpass;
  filter.frequency.value = 600.0;
  filter.Q.value = 1;

  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  // analyser.frequencyBinCount = 10000;
  analyser.smoothingTimeConstant = 0.5;
  // mediaStream.connect(analyser);
  mediaStream.connect(filter);
  filter.connect(analyser)

  // console.log(analyser)
  // console.log(mediaStream)
  // console.log(filter)

  // Add filter
  // First a bandpassfilter for catching all frequencies a human can produce
  // Then boost the more common with a peaking- or bandpass-filter

  // Good bandpass values might be from 150 to 4000

}

function analysis()
{
  var bufferLength = analyser.frequencyBinCount;
  var buffer = new Float32Array(bufferLength);
  analyser.getFloatFrequencyData(buffer);

  //find the frequency with largest peak
  var max_index = 0;
  for(var i = 1; i < bufferLength; i++)
  {
    if((buffer[i]) > (buffer[max_index]))
      max_index = i;
  }

  //take the mean value of all the frequencies over the threshold
  var threshold = 5;
  var peaks = [];
  for(var i = 0; i < bufferLength; i++)
  {
    if(buffer[i] > (buffer[max_index]-threshold))
      peaks.push(i);
  }

  var sum = 0;
  for(var i = 0; i < peaks.length; i++)
  {
    sum += peaks[i];
  }
  var freq = sum / peaks.length;

  document.getElementById('freq').innerHTML = Math.abs(freq*20);
  document.getElementById('max').innerHTML = max_index*20;

  var result = (freq*20)*2;
  console.log(result);

  return result;
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
          temp *= (k-x[j])/(x[i]-x[j])
          console.log(temp)
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

function addTrace(val)
{
  if(trace.length > 50)
  {
    var aux = []
    for(var i = 1; i < 50; i++)
    {
      aux.push(trace[i]);
    }
    aux.push(val)
    trace = aux;
  }
  else
    trace.push(val)
}
