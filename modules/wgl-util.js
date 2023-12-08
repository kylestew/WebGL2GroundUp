function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // check for errors
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    throw "could not compile shader:" + gl.getShaderInfoLog(shader);
  }

  return shader;
}

function createProgramFromSources(gl, vertexShader, fragmentShader) {
  const vsh = createShader(gl, gl.VERTEX_SHADER, vertexShader);
  const fsh = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);

  const program = gl.createProgram();

  gl.attachShader(program, vsh);
  gl.attachShader(program, fsh);

  gl.linkProgram(program);

  // check for errors
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    throw "program failed to link:" + gl.getProgramInfoLog(program);
  }

  return program;
}

/// Takes in one or more arrays of data and creates a buffer on the GPU
/// array names must match attribute names in the shader
/// - arrays: { arrayName: { numComponents, type, data } }
function createVAOFromArrays(gl, shaderProgram, arrays) {
  // one VAO contains all arrays
  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  let indexCount = undefined;

  // for each array, create a buffer and describe how to read it
  Object.keys(arrays).forEach((arrayName) => {
    const array = arrays[arrayName];
    const attribName = arrayName;
    const numComponents = array.numComponents || 3;
    const type = array.type;
    const normalize = false; // what even is this?
    const stride = 0; // assuming non-interleaved data
    const offset = 0; // assuming non-interleaved data

    // keep track of smallest array length to use as index count
    const count = array.data.length / numComponents;
    if (indexCount === undefined || count < indexCount) {
      indexCount = count;
    }

    // load buffer into GPU memory
    const buffer = gl.createBuffer();
    if (!buffer) {
      throw new Error("Failed to create buffer");
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(array.data),
      gl.STATIC_DRAW
    );

    // add description to VAO
    const attribLocation = gl.getAttribLocation(shaderProgram, attribName);
    if (attribLocation === -1) {
      throw new Error(`Failed to get attribute location for ${attribName}`);
    }

    console.log(
      "vertixAttribPointer ::",
      attribName,
      attribLocation,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );

    gl.enableVertexAttribArray(attribLocation);
    gl.vertexAttribPointer(
      attribLocation,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
  });

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindVertexArray(null);

  return {
    buffer: vao,
    count: indexCount,
  };
}

export { createProgramFromSources, createVAOFromArrays };
