import { shaderLoader } from "../modules/shader-loader.js";
import { createCube } from "../modules/primitives.js";
import {
  createBufferInfoFromArrays,
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes,
  setUniforms,
  m4,
} from "../modules/twgl-full.module.js";

const vertShader = "../shaders/perspective.vert";
const fragShader = "../shaders/basic.frag";

async function init() {
  const gl = document.getElementById("gl-canvas").getContext("webgl2");
  const programInfo = await shaderLoader(gl, vertShader, fragShader);

  const modelObj = {
    buffers: createBufferInfoFromArrays(gl, createCube()),
  };

  function render(time) {
    time *= 0.001; // ms -> seconds

    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const uniforms = {};

    // Model Matrix: Model Space -> World Space
    // rotate cube around its axis over time
    var m = m4.identity();
    m = m4.scale(m, [0.5, 0.5, 0.5]);
    m = m4.rotateX(m, (Math.sin(time * 0.25) * Math.PI) / 4.0);
    m = m4.rotateY(m, time * 0.5);
    uniforms.u_model = m;

    // View Matrix: World Space -> View Space
    const eye = [0, 0, 2];
    const camera = m4.translate(m4.identity(), eye);
    const view = m4.inverse(camera);
    uniforms.u_view = view;

    // Projection Matrix: View Space -> Clip Space (device normalized coords)
    // const fov = Math.PI * 0.25;
    const fov = (45 * Math.PI) / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100;
    uniforms.u_projection = m4.perspective(fov, aspect, zNear, zFar);
    // mat.print(uniforms.u_projection);

    // draw
    draw(gl, modelObj, programInfo, uniforms);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function draw(gl, object, programInfo, uniforms) {
  gl.useProgram(programInfo.program);
  setBuffersAndAttributes(gl, programInfo, object.buffers);
  setUniforms(programInfo, uniforms);
  gl.drawElements(
    gl.TRIANGLES,
    object.buffers.numElements,
    gl.UNSIGNED_SHORT,
    0
  );
}

init();
