const { inv } = require("mathjs");

//function multiplyMatrices(U, V) {
//  var Z = [];
//  for (var i = 0; i < U.length; i++) {
//    Z[i] = [];
//    for (var j = 0; j < V[0].length; j++) {
//      var sum = 0;
//      for (var k = 0; k < U[0].length; k++) {
//        sum += U[i][k] * V[k][j];
//     }
//      Z[i][j] = sum;
//    }
//  }
//  return Z;
//}

function DiffVec(a, b) {
  const uLen = a.length;
  var out = Array(uLen);
  for (var col = 0; col < uLen; col++) {
    out[col] = a[col] - b[col];
  }
  return out;
}

function multiply(a, b) {
  var aNumRows = a.length,
    aNumCols = a[0].length,
    bNumRows = b.length,
    bNumCols = b[0].length,
    m = new Array(aNumRows); // initialize array of rows
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols); // initialize the current row
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0; // initialize the current cell
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
    }
  }
  return m;
}

function multiplyVec(A, b) {
  var aNumRows = A.length,
    aNumCols = A[0].length,
    bNumCols = 1,
    m = new Array(aNumRows); // initialize array of rows
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols); // initialize the current row
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0; // initialize the current cell
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += A[r][i] * b[i];
      }
    }
  }
  return m;
}

function constructIdentity(num) {
  const res = [];
  for (let i = 0; i < num; i++) {
    if (!res[i]) {
      res[i] = [];
    }
    for (let j = 0; j < num; j++) {
      if (i === j) {
        res[i][j] = 1;
      } else {
        res[i][j] = 0;
      }
    }
  }
  return res;
}

function constructZeros(ncol, nrow) {
  const res = [];
  for (let col = 0; col < ncol; col++) {
    if (!res[col]) {
      res[col] = [];
    }
    for (let row = 0; row < nrow; row++) {
      res[col][row] = 0;
    }
  }
  return res;
}

function SWHeart(u, v, alpha) {
  var H = [];
  // Predefine H

  const nrow = v.length;
  const ncol = u.length;

  var H = new Array(nrow);

  for (var i = 0; i < H.length; i++) {
    H[i] = new Array(ncol);
  }

  // For each element, calculate heart of W
  for (var col = 0; col < ncol; col++) {
    for (var row = 0; row < nrow; row++) {
      H[row][col] =
        0.5 *
        (alpha * (u[col][0] + v[row][0]) +
          Math.exp(-alpha * (u[col][0] + v[row][0])) -
          alpha * Math.abs(u[col][0] - v[row][0]) -
          Math.exp(-alpha * Math.abs(u[col][0] - v[row][0])));
    }
  }
  return H;
}

M_Obs = [
  [1],
  [2],
  [3],
  [4],
  [5],
  [6],
  [7],
  [8],
  [9],
  [10],
  [11],
  [12],
  [13],
  [14],
  [15],
  [16],
  [17],
  [18],
  [19],
  [20],
];
r_Obs = [
  [0.0131074591432979],
  [0.0222629098372424],
  [0.0273403667327403],
  [0.0317884414257146],
  [0.0327205345299401],
  [0.0332867589595655],
  [0.0336112121443886],
  [0.0341947663149128],
  [0.0345165922380981],
  [0.0346854377006694],
  [0.035717334079127],
  [0.0368501673784445],
  [0.0376263620230677],
  [0.0385237084707761],
  [0.0395043823351044],
  [0.0401574909803133],
  [0.0405715278625131],
  [0.0415574765441695],
  [0.0415582458410996],
  [0.042551132694631],
];
ufr = 0.042;
alpha = 0.142068;

function SWCalibrate(r, M, ufr, alpha) {
  const uLen = r_Obs.length;
  var b = [];
  const C = constructIdentity(uLen);

  var p = Array(uLen);
  var d = Array(uLen);
  var Q = constructZeros(uLen, uLen);
  var q = Array(uLen);

  for (var col = 0; col < uLen; col++) {
    //    p = (1+r).^(-M);
    p[col] = Math.pow(1 + r_Obs[col][0], -M_Obs[col][0]);
    //    d = exp(-log(1+ufr) .* M);
    d[col] = Math.exp(-Math.log(1 + ufr) * M_Obs[col][0]);
    //    Q = diag(d) * C;
    Q[col][col] = C[col][col] * d[col];
  }
  //    q = C'*d;
  q = multiplyVec(C, d);
  var H = SWHeart(M_Obs, M_Obs, alpha);

  //    H = SWHeart(M, M, alpha);
  temp = multiply(multiply(Q, H), Q);

  temp2 = DiffVec(p, q);

  //    b = (Q' * H * Q)\(p-q);
  b = multiplyVec(inv(temp), temp2);

  return b;
}

b = SWCalibrate(r_Obs, M_Obs, ufr, alpha);
console.table(b);

// Projection

T_Obs = [
  [1],
  [2],
  [3],
  [4],
  [5],
  [6],
  [7],
  [8],
  [9],
  [10],
  [11],
  [12],
  [13],
  [14],
  [15],
  [16],
  [17],
  [18],
  [19],
  [20],
  [21],
  [22],
  [23],
  [24],
  [25],
  [26],
  [27],
  [28],
  [29],
  [30],
  [31],
  [32],
  [33],
  [34],
  [35],
  [36],
  [37],
  [38],
  [39],
  [40],
  [41],
  [42],
  [43],
  [44],
  [45],
  [46],
  [47],
  [48],
  [49],
  [50],
  [51],
  [52],
  [53],
  [54],
  [55],
  [56],
  [57],
  [58],
  [59],
  [60],
  [61],
  [62],
  [63],
  [64],
  [65],
  [66],
];

const uLen = r_Obs.length;
var b = [];
const C = constructIdentity(uLen);

var p = Array(uLen);
var d = Array(uLen);
var Q = constructZeros(uLen, uLen);

//var H = SWHeart(M_Obs, M_Obs, alpha);
