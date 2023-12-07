import { shaderLoader } from "../modules/shader-loader.js";
import { createCube } from "../modules/primitives.js";
import {
  createBufferInfoFromArrays,
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes,
  setUniforms,
  m4,
} from "../modules/twgl-full.module.js";
// import bunny from "../modules/bunny.js";

const vertShader = "../shaders/basic.vert";
const fragShader = "../shaders/basic.frag";

class Mesh {
  constructor(gl, arrays) {
    this.model = m4.identity();
    this.buffers = createBufferInfoFromArrays(gl, arrays);
  }

  bind(gl, shaderInfo) {
    // bind buffers and attributes
    setBuffersAndAttributes(gl, shaderInfo, this.buffers);

    // set model transform uniform
    const uniforms = {};
    uniforms.u_transform = this.model;
    setUniforms(shaderInfo, uniforms);
  }

  draw(gl) {
    gl.drawElements(
      gl.LINES,
      // gl.TRIANGLES,
      this.buffers.numElements,
      gl.UNSIGNED_SHORT,
      0
    );
  }
}

async function init() {
  const gl = document.getElementById("gl-canvas").getContext("webgl2");

  const cube = createCube(1.0);
  const mesh = new Mesh(gl, cube);

  const programInfo = await shaderLoader(gl, vertShader, fragShader);

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
    mesh.model = m;

    // draw
    gl.useProgram(programInfo.program);
    mesh.bind(gl, programInfo);
    mesh.draw(gl);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

init();
