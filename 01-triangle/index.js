/*
 == WebGL2 from the ground up - no magic

 Everything needed to render and rotate a 2D triangle exists in this file (and the browser libs)
*/

const vertexShaderSource = /* glsl */ `#version 300 es
in vec2 a_position;
in vec4 a_color;

uniform mat2 u_model;

out vec4 v_color;

void main() {
  gl_Position = vec4(a_position, 0, 1);
  v_color = a_color;
}
`;

const fragmentShaderSource = /* glsl */ `#version 300 es
precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
  outColor = v_color;
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // check for errors
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    throw "could not compile shader:" + gl.getShaderInfoLog(shader);
  }

  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  // check for errors
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    throw "program failed to link:" + gl.getProgramInfoLog(program);
  }

  return program;
}

function resizeCanvasToDisplaySize(canvas) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

async function init() {
  // get GL context from canvas element (in our HTML)
  const gl = document.getElementById("gl-canvas").getContext("webgl2");
  if (!gl) {
    alert("WebGL2 is not available in your browser.");
    return;
  }

  // compile/link shaders
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );
  const program = createProgram(gl, vertexShader, fragmentShader);

  // POSITIONs
  // prettier-ignore
  const positions = [
    0.0, 0.0,
    0.0, 0.5,
    0.7, 0.0
  ];

  // COLORs
  // prettier-ignore
  const colors = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0
  ];

  // all data must be in a single array before uploading to the GPU and setting up the VAO
  // prettier-ignore
  const combinedData = [
    positions[0], positions[1], colors[0], colors[1], colors[2], colors[3],
    positions[2], positions[3], colors[4], colors[5], colors[6], colors[7],
    positions[4], positions[5], colors[8], colors[9], colors[10], colors[11]
  ];

  // upload combined data to the GPU
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(combinedData),
    gl.STATIC_DRAW
  );

  // data is stored a GL buffer, now we need to describe how to read it
  // create our VAO and bind it
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // describe the buffer layout to the VAO
  const positionSize = 2; // 2 components per position (vec2)
  const colorSize = 4; // 4 components per color (vec4)
  const type = gl.FLOAT; // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = (positionSize + colorSize) * 4; // byte stride of each vertex
  const positionOffset = 0; // start at the beginning of the buffer
  const colorOffset = positionSize * 4; // skip the position component

  // position attribute layout
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position"); // vec2
  console.log(positionAttributeLocation);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(
    positionAttributeLocation,
    positionSize,
    type,
    normalize,
    stride,
    positionOffset
  );

  // color attribute layout
  const colorAttributeLocation = gl.getAttribLocation(program, "a_color"); // vec4
  console.log(colorAttributeLocation);
  gl.enableVertexAttribArray(colorAttributeLocation);
  gl.vertexAttribPointer(
    colorAttributeLocation,
    colorSize,
    type,
    normalize,
    stride,
    colorOffset
  );

  //....
  // get uniform locations
  const modelUniformLocation = gl.getUniformLocation(program, "u_model"); // mat2
  // TODO: setup mat2 uniform
  //....

  // size gl drawingbuffer to canvas size
  resizeCanvasToDisplaySize(gl.canvas);

  // help GL with clip space to screen space conversion
  // NOTE: not aspect aware
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  function render(now) {
    const time = now * 0.001; // ms -> seconds

    // clear the canvas
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // use our shader program
    gl.useProgram(program);

    // what set of buffers to use
    gl.bindVertexArray(vao);

    // update model transform uniform
    let rotVector = [
      [1, 0],
      [0, 1],
    ];
    /*
    function rotateVec2(v, theta) {
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    return [
        v[0] * cosTheta - v[1] * sinTheta,
        v[0] * sinTheta + v[1] * cosTheta
    ];
}
*/
    gl.uniformMatrix2fv(modelUniformLocation, false, rotVector);

    // finally! draw something
    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 3;
    gl.drawArrays(primitiveType, offset, count);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  /*
  const triangleObj = {
    transform_mat: mat.identity(),
    buffers: createTriangleObj(gl),
  };

  mat.print(triangleObj.transform_mat);

  function render(time) {
    time *= 0.001; // ms -> seconds

    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const uniforms = {};

    // upate transformation
    var m = mat.identity();
    const t = Math.sin(time);
    const s = Math.cos(time);

    m = mat.rotate(m, time, [0, 0, 1]); // 2D rotation

    // // scale
    // m = mat.uniformScale(m, t);
    // m = mat.translate(m, [s / 2, s * 0.2, 0]);
    // rotate
    // mat.print(m);
    triangleObj.transform_mat = m;


*/
}

init();
