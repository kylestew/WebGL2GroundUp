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

  // TODO: invoke multiply here
  // return mT * m;

  return mT;
}

function uniformScale(m, s) {
  return scale(m, [s, s, s]);
}

function createTranslation(v) {}

function translate(mat, v) {}

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
  scale,
  uniformScale,
  translate,
  print,
};
export default mat;
