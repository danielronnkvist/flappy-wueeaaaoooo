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
  filter.type = filter.NOCTH;
  filter.frequency.value = 60.0;

  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  mediaStream.connect(filter);
  filter.connect(analyser);

  // Add filter
  // First a bandpassfilter for catching all frequencies a human can produce
  // Then boost the more common with a peaking- or bandpass-filter

  // Good bandpass values might be from 150 to 4000
  //



  requestAnimFrame(analysis)
}

function analysis()
{
  var buffer = new Uint8Array(this.analyser.frequencyBinCount);

  analyser.getByteFrequencyData(buffer);
  var max_index = 0
  for(var i = 1; i < buffer.length; i++)
  {
    if(buffer[i] > buffer[0])
    {
      max_index = i;
    }
  }
  // Should set a max limit to how many records there can be in trace
  trace.push(buffer[max_index])
  var x = []
  var a = []
  for(var i = trace.length-1; i >= 0; i-=4)
  {
    x.push(i);
    a.push(i);
  }
  var data = interpolate(a,x,trace)
  var data2 = correlate(buffer, 24000);
  document.getElementById('freq').innerHTML = buffer[max_index]
  document.getElementById('calc').innerHTML = data[a.length-1]
  document.getElementById('freq2').innerHTML = data2

  // var correlation = correlate(buffer, audioContext.sampleRate);

  // get that pitch shit to make som game magic
  requestAnimFrame(analysis)
}

function correlate(buffer, sampleRate)
{
  // get some pitch shit
  //buffer = Math.log(Math.abs(buffer));
  //this.analyser.getByteTimeDomainData(Math.log(Math.abs(buffer)));

  var ms2 = Math.floor(sampleRate * 0.001);
  var ms20 = Math.floor(sampleRate * 0.1);
  var max = 0;
  var count = 0;

  for (var j = ms2; j < ms20 ; j++)
  {
    var temp = Math.abs(buffer[j]);
    if(temp > max)
    {
      max = temp;
      count++;
    }
  }
  max = sampleRate / (ms2+count-1);
  if(max < 500)                   
  {
    console.log(max);
  }
  return max;
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
