import { shaderLoader } from "../modules/shader-loader.js";
import {
  createBufferInfoFromArrays,
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes,
  setUniforms,
} from "../modules/twgl-full.module.js";
import cube from "../modules/cube.js";

const vertShader = "../shaders/basic.vert";
const fragShader = "../shaders/basic.frag";

async function init() {
  const gl = document.getElementById("gl-canvas").getContext("webgl");
  const programInfo = await shaderLoader(gl, vertShader, fragShader);

  console.log(programInfo);

  const bufferInfo = createBufferInfoFromArrays(gl, cube);

  console.log(bufferInfo);

  const uniforms = {
    // u_projection: m
  };

  function render(time) {
    time *= 0.001; // ms -> seconds

    draw(gl, time, programInfo, bufferInfo, uniforms);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function draw(gl, time, programInfo, bufferInfo, uniforms) {
  // TODO: WTF does this viewport thingy do again?
  // resizeCanvasToDisplaySize(gl.canvas);
  // gl.viewport(0, 0, gl.canvas.viewport, gl.canvas.height);

  gl.enable(gl.DEPTH_TEST);
  // gl.enable(gl.CULL_FACE);
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(programInfo.program);
  setBuffersAndAttributes(gl, programInfo, bufferInfo);
  setUniforms(programInfo, uniforms);
  gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
}

init();
