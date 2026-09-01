(function () {
  'use strict';

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var widthInput = document.getElementById('widthInput');
  var widthVal = document.getElementById('widthVal');
  var btnClear = document.getElementById('btnClear');
  var btnExport = document.getElementById('btnExport');

  var currentColor = '#0A101E';
  var drawing = false;
  var lastPoint = null;
  var hasStrokes = false;

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  function getPos(e) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function start(e) {
    drawing = true;
    lastPoint = getPos(e);
    canvas.setPointerCapture(e.pointerId);
  }

  function move(e) {
    if (!drawing) return;
    var point = getPos(e);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = parseFloat(widthInput.value);
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPoint = point;
    hasStrokes = true;
  }

  function end() {
    drawing = false;
    lastPoint = null;
  }

  canvas.addEventListener('pointerdown', start);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('pointerleave', end);

  document.querySelectorAll('.color-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.color-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentColor = btn.dataset.color;
    });
  });

  widthInput.addEventListener('input', function () {
    widthVal.textContent = widthInput.value;
  });

  btnClear.addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasStrokes = false;
  });

  btnExport.addEventListener('click', function () {
    canvas.toBlob(function (blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'signature.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }, 'image/png');
  });
})();
