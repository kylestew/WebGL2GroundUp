const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const buffer = context.getImageData(0, 0, canvas.width, canvas.height);
const pitch = buffer.width * 4;

/*
Low-level canvas access
*/

var putPixel = function (x, y, color) {
  x = canvas.width / 2 + x;
  y = canvas.height / 2 - y - 1;

  if (x < 0 || x > canvas.width || y < 0 || y >= canvas.height) {
    return;
  }

  var offset = 4 * x + pitch * y;
  buffer.data[offset++] = color[0];
  buffer.data[offset++] = color[1];
  buffer.data[offset++] = color[2];
  buffer.data[offset++] = 255; // full opacity
};

var updateCanvas = function () {
  context.putImageData(buffer, 0, 0);
};

/*
Basic Raytracer
*/

var viewport_size = 1;

// converts 2D canvas coordinates to 3D viewport coordinates
var canvasToViewport = function (p2d) {
  return [
    (p2d[0] * viewport_size) / canvas.width,
    (p2d[1] * viewport_size) / canvas.height,
    0,
  ];
};

/*
Main loop
*/

for (var x = -canvas.width / 2; x < canvas.width / 2; x++) {
  for (var y = -canvas.height / 2; y < canvas.height / 2; y++) {
    var direction = canvasToViewport([x, y]);

    var color = [
      Math.abs(direction[0]) * 255,
      Math.abs(direction[1]) * 255,
      Math.abs(direction[2]) * 255,
    ];
    putPixel(x, y, color);
  }
}

updateCanvas();
