function draw(foundPolynome) {
  try {
    const initialPolynome = {
      fn: document.getElementById('eq').value,
      sampler: 'builtIn',
      graphType: 'polyline'
    }
    const interpolatedPolynome = {
      fn: foundPolynome,
      sampler: 'builtIn',
      graphType: 'polyline'
    }
    functionPlot({
      target: '#plot',
      width: 600,
      height: 400,
      grid: true,
      data: [
        initialPolynome,
        interpolatedPolynome
      ]
    });
  } catch (err) {
    console.log(err);
    alert(err);
  }
}

document.getElementById('form').onsubmit = (event) => {
  event.preventDefault();
  let xValues = document.getElementById('xValues').value.split(',').map(item => parseInt(item, 10));
  let yValues = document.getElementById('yValues').value.split(',').map(item => parseInt(item, 10));
  interpolation(xValues, yValues);
};

draw('');

function interpolation(x, y) {
  let result = [];
  for (let k = 0; k < x.length; k++) {
    result[k] = 0;
  }
  for (let i = 0; i < x.length; i++) {
    var basis = [1];
    for (let j = 0; j < x.length; j++) {
      if (i != j) {
        if (x[i] == x[j]) {
          throw new Error("All x-values must be distinct");
        }
        basis = conv(basis, [1, -x[j]]).map(z => {
          return z / (x[i] - x[j]);
        });
      }
    }
    result = result.map(function (r, k) {
      return r + y[i] * basis[k];
    });
  }
  value(result);
}

function conv(x, y) {
  let result = [];
  for (let k = 0; k < x.length + y.length - 1; k++) {
    let sum = 0;
    for (let i = 0; i < x.length; i++) {
      let j = k - i;
      if (j >= 0 && j < y.length) {
        sum += x[i] * y[j];
      }
    }
    result[k] = sum;
  }
  return result;
}

function value(result) {
  result = result.map(item => Math.round(item * 10) / 10);
  let n = result.length - 1;
  let polynome = "";
  for (let i = 0; i < result.length; i++) {
    if (result[i] > 0) {
      if (result[i] == 1) {
        if (n - i == 1)
          polynome += ' + ' + 'x';
        else
          polynome += (n - i == 0) ? ' + ' + result[i] : ' + ' + 'x' + (n - i).toString().sup();
      } else {
        if (n - i == 1)
          polynome += ' + ' + result[i] + 'x';
        else
          polynome += (n - i == 0) ? ' + ' + result[i] : ' + ' + result[i] + 'x' + (n - i).toString().sup();
      }
    } else if (result[i] < 0) {
      if (result[i] == -1) {
        if (n - i == 1)
          polynome += ' - ' + 'x';
        else
          polynome += (n - i == 0) ? ' - ' + Math.abs(result[i]) : ' - ' + 'x' + (n - i).toString().sup();
      } else {
        if (n - i == 1)
          polynome += ' - ' + Math.abs(result[i]) + 'x';
        else
          polynome += (n - i == 0) ? ' - ' + Math.abs(result[i]) : ' - ' + Math.abs(result[i]) + 'x' + (n - i).toString().sup();
      }
    }
  }
  if (polynome[1] == '+')
    polynome = polynome.substr(2);
  let polynomeCopy = polynome.replace(/ /g, "");
  let convertedPolynome = "";
  for (let i = 0; i < polynomeCopy.length;) {
    if (polynomeCopy[i] == 'x' && polynomeCopy[i + 1] == '<') {
      if (polynomeCopy[i - 1] == '-')
        convertedPolynome += '1*x^' + polynomeCopy[i + 6];
      else {
        if (i - 1 < 0)
          convertedPolynome += 'x^' + polynomeCopy[i + 6];
        else
          convertedPolynome += '*x^' + polynomeCopy[i + 6];
      }
      i += 13;
    } else if (polynomeCopy[i] == 'x' && polynomeCopy[i + 1] != '<') {
      if (polynomeCopy[i - 1] == '-')
        convertedPolynome += '1*x';
      else {
        if (i - 1 < 0)
          convertedPolynome += 'x';
        else
          convertedPolynome += '*x'
        i++;
      }
    } else {
      convertedPolynome += polynomeCopy[i];
      i++;
    }
  }
  let evalPolynome = convertedPolynome.replace(/\^/g, '**');

  let xValues = document.getElementById('xValues').value.split(',').map(item => parseInt(item, 10));
  const outputValues = document.getElementById('outputValues');
  outputValues.innerHTML = "";
  for (let i = 0; i < xValues.length; i++) {
    const x = xValues[i];
    outputValues.innerHTML += `L(${x}) = ${eval(evalPolynome)}<br>`;
  }
  document.getElementById('outputPolynome').innerHTML = `<strong>L(x)</strong> = ${polynome}`;
  document.getElementsByClassName('output')[0].style.display = 'block';

  draw(convertedPolynome);
}