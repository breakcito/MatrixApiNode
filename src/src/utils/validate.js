
// verificar que la matriz sea valida
export function validateMatrix(m, name) {
  const rows = m.length;
  const cols = m[0].length;

  for (let i = 0; i < rows; i++) {
    if (!Array.isArray(m[i]) || m[i].length !== cols) {
      throw new Error(`La matriz "${name}" no es rectangular en la fila ${i}`);
    }

    for (let j = 0; j < cols; j++) {
      const val = m[i][j];

      if (typeof val !== 'number' || Number.isNaN(val)) {
        throw new Error(`La matriz "${name}" contiene NaN en [${i}][${j}]`);
      }

      if (!Number.isFinite(val)) {
        throw new Error(`La matriz "${name}" contiene Infinito en [${i}][${j}]`);
      }
    }
  }
}
