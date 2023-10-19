import { shaderLoader } from "../modules/shader-loader.js";
import {
  primitives,
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes,
  setUniforms,
  m4,
  v3,
} from "../modules/twgl-full.module.js";

const vertShader = "../shaders/phong.vert";
const fragShader = "../shaders/phong.frag";

async function init() {
  const gl = document.getElementById("gl-canvas").getContext("webgl2");
  const programInfo = await shaderLoader(gl, vertShader, fragShader);

  const obj = {
    materialColor: v3.create(0.9, 0.3, 0.2),
    buffers: primitives.createTorusBufferInfo(gl, 2.0, 0.5, 128, 64),
  };

  function render(time) {
    time *= 0.001; // ms -> seconds

    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const uniforms = {};

    // update camera
    const eye = [0, 0, -9];
    const target = [0, 0, 0];
    const up = [0, 1, 0];
    const camera = m4.lookAt(eye, target, up);
    const view = m4.inverse(camera);
    uniforms.uView = view;

    const fov = (45 * Math.PI) / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = m4.perspective(fov, aspect, zNear, zFar);
    uniforms.uProjection = projectionMatrix;

    // update lights
    uniforms.uAmbientColor = v3.create(0.0, 0.0, 0.8);
    uniforms.uAmbientIntensity = 0.5;

    uniforms.uDiffuseColor = v3.create(1, 0.8, 0.8);
    uniforms.uDiffuseIntensity = 1.2;

    uniforms.uSpecularColor = v3.create(1.0, 1.0, 1.0);
    uniforms.uSpecularIntensity = 0.7;

    uniforms.uLightPosition = [0, 10 * Math.sin(time * 0.5), 0];

    // draw a torus
    var m = m4.identity();
    m = m4.rotateX(m, time * -0.333);
    m = m4.rotateZ(m, time * 0.333);
    uniforms.uModel = m;
    uniforms.uMaterialColor = obj.materialColor;
    draw(gl, obj, programInfo, uniforms);

    // draw a 2nd torus
    var m = m4.identity();
    m = m4.rotateX(m, time * 0.333);
    // m = m4.rotateX(m, time * -0.4);
    uniforms.uModel = m;
    uniforms.uMaterialColor = obj.materialColor;
    draw(gl, obj, programInfo, uniforms);

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
