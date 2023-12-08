export default function resizeCanvas(gl) {
  const canvas = gl.canvas;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  // NOTE: not aspect aware - wait until we have a camera
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}
