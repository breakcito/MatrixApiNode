// verificar que la matriz sea valida
export function validateMatrix(m, name) {
  if (!Array.isArray(m) || m.length === 0) {
    throw new Error(`La matriz "${name}" no puede estar vacía`);
  }

  if (!Array.isArray(m[0]) || m[0].length === 0) {
    throw new Error(`Las filas de la matriz "${name}" no pueden estar vacías`);
  }

  const rows = m.length;
  const cols = m[0].length;

  const maxRows = parseInt(process.env.MATRIX_MAX_ROWS, 10) || 100;
  const maxCols = parseInt(process.env.MATRIX_MAX_COLUMNS, 10) || 100;
  const maxElements = parseInt(process.env.MATRIX_MAX_ELEMENTS, 10) || 10000;

  if (rows > maxRows) {
    throw new Error(
      `La matriz "${name}" excede el número máximo de filas permitido: ${rows} > ${maxRows}`
    );
  }

  if (cols > maxCols) {
    throw new Error(
      `La matriz "${name}" excede el número máximo de columnas permitido: ${cols} > ${maxCols}`
    );
  }

  if (rows * cols > maxElements) {
    throw new Error(
      `La matriz "${name}" excede el número total de elementos permitido: ${rows * cols} > ${maxElements}`
    );
  }

  for (let i = 0; i < rows; i++) {
    if (!Array.isArray(m[i]) || m[i].length !== cols) {
      throw new Error(`La matriz "${name}" no es rectangular en la fila ${i}`);
    }

    for (let j = 0; j < cols; j++) {
      const val = m[i][j];

      if (typeof val !== "number") {
        throw new Error(
          `La matriz "${name}" contiene un valor no numérico en [${i}][${j}]`
        );
      }

      if (Number.isNaN(val)) {
        throw new Error(`La matriz "${name}" contiene NaN en [${i}][${j}]`);
      }

      if (!Number.isFinite(val)) {
        throw new Error(
          `La matriz "${name}" contiene Infinito en [${i}][${j}]`
        );
      }
    }
  }
}
