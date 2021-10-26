function identity() {
  var dst = new Float32Array(16);

  dst[0] = 1;
  dst[1] = 0;
  dst[2] = 0;
  dst[3] = 0;

  dst[4] = 0;
  dst[5] = 1;
  dst[6] = 0;
  dst[7] = 0;

  dst[8] = 0;
  dst[9] = 0;
  dst[10] = 1;
  dst[11] = 0;

  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;

  return dst;
}

// prettier-ignore
// multiply two vectors
function multiply(a, b) {
  var dst = new Float32Array(16);

  const a00 = a[0];
  const a01 = a[1];
  const a02 = a[2];
  const a03 = a[3];
  const a10 = a[ 4 + 0];
  const a11 = a[ 4 + 1];
  const a12 = a[ 4 + 2];
  const a13 = a[ 4 + 3];
  const a20 = a[ 8 + 0];
  const a21 = a[ 8 + 1];
  const a22 = a[ 8 + 2];
  const a23 = a[ 8 + 3];
  const a30 = a[12 + 0];
  const a31 = a[12 + 1];
  const a32 = a[12 + 2];
  const a33 = a[12 + 3];
  const b00 = b[0];
  const b01 = b[1];
  const b02 = b[2];
  const b03 = b[3];
  const b10 = b[ 4 + 0];
  const b11 = b[ 4 + 1];
  const b12 = b[ 4 + 2];
  const b13 = b[ 4 + 3];
  const b20 = b[ 8 + 0];
  const b21 = b[ 8 + 1];
  const b22 = b[ 8 + 2];
  const b23 = b[ 8 + 3];
  const b30 = b[12 + 0];
  const b31 = b[12 + 1];
  const b32 = b[12 + 2];
  const b33 = b[12 + 3];

  dst[ 0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
  dst[ 1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
  dst[ 2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
  dst[ 3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;
  dst[ 4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
  dst[ 5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
  dst[ 6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
  dst[ 7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;
  dst[ 8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
  dst[ 9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
  dst[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
  dst[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;
  dst[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
  dst[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
  dst[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
  dst[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;

  return dst;
}

// prettier-ignore
function createTranslation(v) {
  var dst = identity();

  // OpenGL matrices don't follow the order of the textbook
  dst[12] = v[0];
  dst[13] = v[1];
  dst[14] = v[2];
  dst[15] = 1;

  return dst;
}

function translate(m, v) {
  var mT = createTranslation(v);
  return multiply(mT, m);
}

// prettier-ignore
function createScale(v) {
  var dst = new Float32Array(16);

  dst[ 0] = v[0];
  dst[ 1] = 0;
  dst[ 2] = 0;
  dst[ 3] = 0;
  dst[ 4] = 0;
  dst[ 5] = v[1];
  dst[ 6] = 0;
  dst[ 7] = 0;
  dst[ 8] = 0;
  dst[ 9] = 0;
  dst[10] = v[2];
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;

  return dst;
}

function scale(m, v) {
  var mT = createScale(v);
  return multiply(mT, m);
}

function uniformScale(m, s) {
  return scale(m, [s, s, s]);
}

function print(mat) {
  const prec = 2;
  console.log("=======================");
  console.log(
    "|",
    mat[0].toFixed(prec),
    mat[4].toFixed(prec),
    mat[8].toFixed(prec),
    mat[12].toFixed(prec),
    "|"
  );
  console.log(
    "|",
    mat[1].toFixed(prec),
    mat[5].toFixed(prec),
    mat[9].toFixed(prec),
    mat[13].toFixed(prec),
    "|"
  );
  console.log(
    "|",
    mat[2].toFixed(prec),
    mat[6].toFixed(prec),
    mat[10].toFixed(prec),
    mat[14].toFixed(prec),
    "|"
  );
  console.log(
    "|",
    mat[3].toFixed(prec),
    mat[7].toFixed(prec),
    mat[11].toFixed(prec),
    mat[15].toFixed(prec),
    "|"
  );
  console.log("=======================");
}

const mat = {
  identity,
  translate,
  scale,
  uniformScale,
  print,
};
export default mat;
