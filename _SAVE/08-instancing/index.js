import { shaderLoader } from "../modules/shader-loader.js";
import {
  createBufferInfoFromArrays,
  createVertexArrayInfo,
  primitives,
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes,
  setUniforms,
  drawBufferInfo,
  m4,
  v3,
} from "../modules/twgl-full.module.js";
import materials from "../modules/materials.js";

const vertShader = "../shaders/instancing.vert";
const fragShader = "../shaders/material.frag";

async function init() {
  const gl = document.getElementById("gl-canvas").getContext("webgl2");
  const programInfo = await shaderLoader(gl, vertShader, fragShader);

  function rand(min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    return min + Math.random() * (max - min);
  }

  const numInstances = 10000;
  const instanceWorlds = new Float32Array(numInstances * 16);
  const r = 70;
  for (let i = 0; i < numInstances; ++i) {
    const mat = new Float32Array(instanceWorlds.buffer, i * 16 * 4, 16);
    m4.translation([rand(-r, r), rand(-r, r), rand(-r, r)], mat);
    m4.rotateZ(mat, rand(0, Math.PI * 2), mat);
    m4.rotateX(mat, rand(0, Math.PI * 2), mat);
    // instanceColors.push(rand(1), rand(1), rand(1));
  }
  const arrays = primitives.createCubeVertices();
  Object.assign(arrays, {
    instanceWorld: {
      numComponents: 16,
      data: instanceWorlds,
      divisor: 1,
    },
  });
  const bufferInfo = createBufferInfoFromArrays(gl, arrays);
  const vertexArrayInfo = createVertexArrayInfo(gl, programInfo, bufferInfo);

  console.log(arrays.instanceWorld);

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
    const eye = [1, 2, -12];
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

    uniforms.uMaterial = materials.obsidian;

    // draw instances
    gl.useProgram(programInfo.program);
    setBuffersAndAttributes(gl, programInfo, vertexArrayInfo);
    setUniforms(programInfo, uniforms);
    drawBufferInfo(
      gl,
      vertexArrayInfo,
      gl.TRIANGLES,
      vertexArrayInfo.numElements,
      0,
      numInstances
    );

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

init();
