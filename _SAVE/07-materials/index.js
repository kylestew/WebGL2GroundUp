import { shaderLoader } from "../modules/shader-loader.js";
import {
  primitives,
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes,
  setUniforms,
  m4,
  v3,
} from "../modules/twgl-full.module.js";
import materials from "../modules/materials.js";

const vertShader = "../shaders/material.vert";
const fragShader = "../shaders/material.frag";

async function init() {
  const gl = document.getElementById("gl-canvas").getContext("webgl2");
  const programInfo = await shaderLoader(gl, vertShader, fragShader);

  const obj = {
    buffers: primitives.createTorusBufferInfo(gl, 2.0, 0.5, 128, 64),
    material: materials.obsidian,
  };

  const light = {
    position: v3.create(0),
    ambient: v3.create(0.2, 0.2, 0.2),
    diffuse: v3.create(0.5, 0.5, 0.5),
    specular: v3.create(1.0, 1.0, 1.0),
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

    // update light
    light.position = v3.create(0, 10 * Math.sin(time * 0.5), 0);
    uniforms.uLight = light;

    // draw a torus
    var m = m4.identity();
    m = m4.rotateX(m, time * -0.333);
    m = m4.rotateZ(m, time * 0.333);
    uniforms.uModel = m;
    uniforms.uMaterial = obj.material;
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
