var camera = {
  fov: (30 * Math.PI) / 180,
  zNear: 0.01,
  zFar: 100.0,

  eye: [1, 4, -6],
  target: [0, 0, 0],
  up: [0, 1, 0],

  camera: m4.identity(),
  view: m4.identity(),
  projection: m4.identity(),

  update: function (aspectRatio) {
    this.camera = m4.lookAt(this.eye, this.target, this.up);
    this.view = m4.inverse(this.camera);
    this.projection = m4.perspective(
      this.fov,
      aspectRatio,
      this.zNear,
      this.zFar
    );
  },
};
