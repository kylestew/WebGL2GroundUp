import { shaderLoader } from "../modules/shader-loader.js";
import mat from "../modules/matrix.js";
import {
  createBufferInfoFromArrays,
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes,
  setUniforms,
} from "../modules/twgl-full.module.js";

const vertShader = "../shaders/basic.vert";
const fragShader = "../shaders/basic.frag";

//prettier-ignore
function createTriangleObj(gl) {
  const positions = [
     0.0,  0.0,  0.0, 
     0.5,  0.0,  0.0, 
     0.5,  0.5,  0.0, 
    -0.5,  0.0,  0.0, 
    -0.5, -0.5,  0.0
  ];

  const indices = [
    0, 1, 2, 
    0, 3, 4
  ];

  const colors = [
    1, 0, 0, 1, 
    0, 1, 0, 1, 
    0, 0, 1, 1, 
    1, 1, 0, 1, 
    1, 0, 1, 1, 
    0, 1, 1, 1,
  ];

  const data = {
    position: positions,
    indices: indices,
    color: colors,
  };
  return createBufferInfoFromArrays(gl, data);
}

async function init() {
  const gl = document.getElementById("gl-canvas").getContext("webgl2");
  const programInfo = await shaderLoader(gl, vertShader, fragShader);

  const triangleObj = {
    transform_mat: mat.identity(),
    buffers: createTriangleObj(gl),
  };

  mat.print(triangleObj.transform_mat);

  function render(time) {
    time *= 0.001; // ms -> seconds

    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const uniforms = {};

    // upate transformation
    var m = mat.identity();
    const t = Math.sin(time);
    const s = Math.cos(time);
    // scale
    m = mat.uniformScale(m, t);
    m = mat.translate(m, [s / 2, s * 0.2, 0]);
    // mat.print(m);
    triangleObj.transform_mat = m;

    // draw
    draw(gl, triangleObj, programInfo, uniforms);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function draw(gl, object, programInfo, uniforms) {
  gl.useProgram(programInfo.program);

  setBuffersAndAttributes(gl, programInfo, object.buffers);

  uniforms.u_transform = object.transform_mat;
  setUniforms(programInfo, uniforms);

  gl.drawElements(
    gl.TRIANGLES,
    object.buffers.numElements,
    gl.UNSIGNED_SHORT,
    0
  );
}

init();
