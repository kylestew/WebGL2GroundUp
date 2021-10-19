import { shaderLoader } from "../modules/shader-loader.js";
// import cube from "../modules/cube.js";

const vertShader = "../shaders/basic.vert";
const fragShader = "../shaders/basic.frag";

// function initBuffers(gl) {
//   const positionBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//   gl.bufferData(
//     gl.ARRAY_BUFFER,
//     new Float32Array(cube.positions),
//     gl.STATIC_DRAW
//   );

//   return {
//     position: positionBuffer,
//   };
// }

async function init() {
  const gl = document.getElementById("gl-canvas").getContext("webgl2");
  const program = await shaderLoader(gl, vertShader, fragShader);

  console.log(program);

  // const shader = {
  //   program: program,
  //   // TODO: can we automate this lookup?
  //   attribLocations: {
  //     vertexPositions: gl.getAttribLocation(program, "a_position"),
  //     vertexColor: gl.getAttribLocation(program, "a_color"),
  //   },
  //   uniformLocations: {
  //     projectionMatrix: gl.getUniformLocation(program, "u_projection"),
  //     modelViewMatrix: gl.getUniformLocation(program, "u_modelView"),
  //   },
  // };

  // console.log(shader);

  // const buffers = initBuffers(gl);

  // console.log(buffers);

  // function render(time) {
  //   time *= 0.001; // ms -> seconds

  //   draw(gl, shader, buffers, time);

  //   requestAnimationFrame(render);
  // }
  // requestAnimationFrame(render);
}

function draw(gl, shader, buffers, time) {
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

init();
