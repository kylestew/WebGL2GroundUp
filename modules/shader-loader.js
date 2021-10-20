/* 
Major portions from Mozilla docs:
https://github.com/mdn/webgl-examples/blob/gh-pages/tutorial/sample5/webgl-demo.js 
*/
import { createProgramInfo } from "./twgl-full.module.js";

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(
      "Shaders Compilation Error: " + gl.getShaderInfoLog(shader)
    );
  }
  return shader;
}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertShader);
  gl.attachShader(shaderProgram, fragShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw new Error(
      "Shader Linker Error: " + gl.getProgramInfoLog(shaderProgram)
    );
  }
  return shaderProgram;
}

function shaderLoader(gl, vertPath, fragPath) {
  return Promise.all([fetch(vertPath), fetch(fragPath)])
    .then((responses) => Promise.all(responses.map((r) => r.text())))
    .then((sources) => {
      // return initShaderProgram(gl, sources[0], sources[1]);
      return createProgramInfo(gl, [sources[0], sources[1]]);
    });
}

export { shaderLoader };
export default shaderLoader;
