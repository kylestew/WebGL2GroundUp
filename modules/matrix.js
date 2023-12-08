const m2 = {
  identity() {
    var dst = new Float32Array(4);

    dst[0] = 1;
    dst[1] = 0;

    dst[2] = 0;
    dst[3] = 1;

    return dst;
  },

  // matrix 2-d multiply
  multiply(a, b) {
    var dst = new Float32Array(4); // 2x2 matrix represented as a 1D array with 4 elements

    // Calculate each element of the destination matrix
    dst[0] = a[0] * b[0] + a[1] * b[2];
    dst[1] = a[0] * b[1] + a[1] * b[3];
    dst[2] = a[2] * b[0] + a[3] * b[2];
    dst[3] = a[2] * b[1] + a[3] * b[3];

    return dst;
  },

  // 2d rotate function
  rotate(m, angleInRadians) {
    const cosTheta = Math.cos(angleInRadians);
    const sinTheta = Math.sin(angleInRadians);
    //prettier-ignore
    let rotVector = [
        cosTheta, -sinTheta,
        sinTheta, cosTheta,
        ];
    return this.multiply(rotVector, m);
  },
};

export { m2 };
