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
