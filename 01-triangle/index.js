import { shaderLoader } from "../modules/shader-loader.js";
import {
  m4,
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
    scale_mat: m4.identity(),
    buffers: createTriangleObj(gl),
  };

  console.log(triangleObj);

  function render(time) {
    time *= 0.001; // ms -> seconds

    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const uniforms = {};

    // scale
    const scale = Math.sin(time);
    triangleObj.scale_mat = uniformScaleMat(triangleObj.scale_mat, scale);
    draw(gl, triangleObj, programInfo, uniforms);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function draw(gl, object, programInfo, uniforms) {
  gl.useProgram(programInfo.program);

  setBuffersAndAttributes(gl, programInfo, object.buffers);

  printMatrix(object.scale_mat);

  uniforms.u_scale = object.scale_mat;
  setUniforms(programInfo, uniforms);

  gl.drawElements(
    gl.TRIANGLES,
    object.buffers.numElements,
    gl.UNSIGNED_SHORT,
    0
  );
}

init();

function uniformScaleMat(mat, scale) {
  var dst = new Float32Array(16);
  dst[0] = scale;
  dst[1] = 0;
  dst[2] = 0;
  dst[3] = 0;

  dst[4] = 0;
  dst[5] = scale;
  dst[6] = 0;
  dst[7] = 0;

  dst[8] = 0;
  dst[9] = 0;
  dst[10] = scale;
  dst[11] = 0;

  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;

  return dst;
}

function printMatrix(mat) {
  console.log(mat[0], mat[4], mat[8], mat[12]);
  console.log(mat[1], mat[5], mat[9], mat[13]);
  console.log(mat[2], mat[6], mat[10], mat[14]);
  console.log(mat[3], mat[7], mat[11], mat[15]);
}
