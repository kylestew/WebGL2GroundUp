import { shaderLoader } from "../modules/shader-loader.js";
import cube from "../modules/cube.js";
import {
  createBufferInfoFromArrays,
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes,
  setUniforms,
  m4,
} from "../modules/twgl-full.module.js";

const vertShader = "../shaders/basic.vert";
const fragShader = "../shaders/basic.frag";

async function init() {
  const gl = document.getElementById("gl-canvas").getContext("webgl2");
  const programInfo = await shaderLoader(gl, vertShader, fragShader);

  const triangleObj = {
    model: m4.identity(),
    buffers: createBufferInfoFromArrays(gl, cube),
  };

  function render(time) {
    time *= 0.001; // ms -> seconds

    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // upate transformation
    var m = m4.identity();
    m = m4.scale(m, [0.5, 0.5, 0.5]);
    m = m4.rotateZ(m, time);
    m = m4.rotateY(m, time * -0.6);
    m = m4.rotateX(m, time * 0.4);
    triangleObj.model = m;

    // draw
    const uniforms = {};
    draw(gl, triangleObj, programInfo, uniforms);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function draw(gl, object, programInfo, uniforms) {
  gl.useProgram(programInfo.program);

  setBuffersAndAttributes(gl, programInfo, object.buffers);

  uniforms.u_transform = object.model;
  setUniforms(programInfo, uniforms);

  gl.drawElements(
    gl.TRIANGLES,
    object.buffers.numElements,
    gl.UNSIGNED_SHORT,
    0
  );
}

init();
