/*
 == WebGL2 from the ground up - MAGIC!

 Same functionality as 01-triangle, but with boilerplate hidden in helper modules
*/
import {
  createProgramFromSources,
  createVAOFromArrays,
} from "../modules/wgl-util.js";
import resizeCanvas from "../modules/canvas-resize.js";
import { m3 } from "../modules/matrix.js";

const vertexShaderSource = /* glsl */ `#version 300 es
in vec2 a_position;
in vec4 a_color;

uniform mat3 u_model;

out vec4 v_color;

void main() {
  gl_Position = vec4(u_model * vec3(a_position, 1.0), 1.0);
  v_color = a_color;
}
`;

const fragmentShaderSource = /* glsl */ `#version 300 es
precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
  outColor = v_color;
}
`;

async function init() {
  // get GL context from canvas element (in our HTML)
  const gl = document.getElementById("gl-canvas").getContext("webgl2");
  if (!gl) {
    alert("WebGL2 is not available in your browser.");
    return;
  }

  // compile/link shaders
  const shaderProgram = createProgramFromSources(
    gl,
    vertexShaderSource,
    fragmentShaderSource
  );

  // POSITIONs
  // prettier-ignore
  const positions = [
    0.0, 0.0,
    0.0, 0.5,
    0.75, 0.0
  ];
  const centroid = [0.24, 0.17];

  // COLORs
  // prettier-ignore
  const colors = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0
  ];

  const arrays = {
    a_position: { data: positions, type: gl.FLOAT, numComponents: 2 },
    a_color: { data: colors, type: gl.FLOAT, numComponents: 4 },
  };

  const vaoInfo = createVAOFromArrays(gl, shaderProgram, arrays);

  // get uniform location for our model transform
  const modelUniformLocation = gl.getUniformLocation(shaderProgram, "u_model"); // mat2

  function render(now) {
    const time = now * 0.001; // ms -> seconds

    // size gl drawingbuffer to canvas size
    resizeCanvas(gl);

    // clear the canvas
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(shaderProgram);

    // update model transform uniform
    let modelMat = m3.identity();

    // scale
    modelMat = m3.scale(modelMat, Math.sin(0.333 * time), Math.sin(0.2 * time));

    // center rotate
    modelMat = m3.translate(modelMat, -centroid[0], -centroid[1]);
    const theta = -time * 2.0;
    modelMat = m3.rotate(modelMat, theta);
    modelMat = m3.translate(modelMat, centroid[0], centroid[1]);

    // translate
    modelMat = m3.translate(
      modelMat,
      Math.sin(time) * 0.5,
      Math.cos(time) * 0.5
    );

    gl.uniformMatrix3fv(modelUniformLocation, false, modelMat);

    gl.bindVertexArray(vaoInfo.buffer);
    gl.drawArrays(gl.TRIANGLES, 0, vaoInfo.count);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

init();
