// verificar si una matriz es cuadrada y diagonal
function isDiagonal(matrix, epsilon = 1e-9) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // una matriz diagonal debe ser cuadrada por definición
  if (rows !== cols) return false;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (i !== j && Math.abs(matrix[i][j]) > epsilon) {
        return false;
      }
    }
  }
  return true;
}

// calcular las metricas requeridas
export function calculateStats(matrices) {
  let max = -Infinity;
  let min = Infinity;
  let sum = 0;
  let count = 0;
  let hasDiagonalMat = false;

  for (const matrix of matrices) {
    if (!hasDiagonalMat && isDiagonal(matrix)) {
      hasDiagonalMat = true;
    }

    const rows = matrix.length;
    const cols = matrix[0].length;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const val = matrix[i][j];

        if (val > max) max = val;
        if (val < min) min = val;

        sum += val;
        count++;
      }
    }
  }

  return {
    maxValue: count === 0 ? 0 : max,
    minValue: count === 0 ? 0 : min,
    average: count === 0 ? 0 : sum / count,
    totalSum: sum,
    hasDiagonalMat,
  };
}
