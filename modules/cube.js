// prettier-ignore
const positions = [
  0, 0, 0,
  1, 0, 0,
  1, 1, 0,
  -1, 0, 0,
  -1, -1, 0


  // front face
  // -1.0, -1.0, 1.0,
  // 1.0, -1.0, 1.0,
  // 1.0, 1.0, 1.0,
  // -1.0, 1.0, 1.0,

  // // back face
  // -1.0, -1.0, -1.0,
  // -1.0, 1.0, -1.0,
  // 1.0, 1.0, -1.0,
  // 1.0, -1.0, -1.0,

  // // top face
  // -1.0, 1.0, -1.0,
  // -1.0, 1.0, 1.0,
  // 1.0, 1.0, 1.0,
  // 1.0, 1.0, -1.0,

  // // bottom face
  // -1.0, -1.0, -1.0,
  // 1.0, -1.0, -1.0,
  // 1.0, -1.0, 1.0,
  // -1.0, -1.0, 1.0,

  // // right face
  // 1.0, -1.0, -1.0,
  // 1.0, 1.0, -1.0,
  // 1.0, 1.0, 1.0,
  // 1.0, -1.0, 1.0,

  // // left face
  // -1.0, -1.0, -1.0,
  // -1.0, -1.0, 1.0,
  // -1.0, 1.0, 1.0,
  // -1.0, 1.0, -1.0,
];

const indices = [0, 1, 2, 0, 3, 4];

const colors = [
  1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
];

const cube = {
  position: positions,
  indices: indices,
  color: colors,
};

export default cube;
