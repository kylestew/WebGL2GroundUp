import { shaderLoader } from "../modules/shader-loader.js";
import { createCube, createSphere } from "../modules/primitives.js";
import {
  createBufferInfoFromArrays,
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes,
  setUniforms,
  m4,
} from "../modules/twgl-full.module.js";

const vertShader = "../shaders/lambert.vert";
const fragShader = "../shaders/lambert.frag";

async function init() {
  const gl = document.getElementById("gl-canvas").getContext("webgl2");
  const programInfo = await shaderLoader(gl, vertShader, fragShader);

  const cubeObj = {
    model: m4.identity(),
    buffers: createBufferInfoFromArrays(gl, createCube(2)),
  };

  const sphereObj = {
    model: m4.identity(),
    buffers: createBufferInfoFromArrays(gl, createSphere(1, 24, 16)),
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

    // update camera
    const eye = [0, 4, -6];
    const target = [0, 0, 0];
    const up = [0, 1, 0];
    const camera = m4.lookAt(eye, target, up);
    const view = m4.inverse(camera);
    uniforms.u_view = view;

    const fov = (45 * Math.PI) / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = m4.perspective(fov, aspect, zNear, zFar);
    uniforms.u_projection = projectionMatrix;

    // update and draw cube
    var m = m4.identity();
    m = m4.translate(m, [2.0, 0, 0]);
    m = m4.scale(m, [0.8, 0.8, 0.8]);
    m = m4.rotateZ(m, time);
    m = m4.rotateY(m, time * -0.6);
    m = m4.rotateX(m, time * 0.4);
    cubeObj.model = m;
    uniforms.u_model = cubeObj.model;
    draw(gl, cubeObj, programInfo, uniforms);

    // update and draw sphere
    var m = m4.identity();
    m = m4.translate(m, [-2, 0, 0]);
    m = m4.scale(m, [1.2, 1.2, 1.2]);
    m = m4.rotateZ(m, time);
    m = m4.rotateY(m, time * -0.6);
    m = m4.rotateX(m, time * 0.4);
    sphereObj.model = m;
    uniforms.u_model = sphereObj.model;
    draw(gl, sphereObj, programInfo, uniforms);

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
