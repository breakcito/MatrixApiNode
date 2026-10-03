// valida lel payload recibido
export function parseStatsRequest(body) {
  if (!body || typeof body !== "object") {
    return {
      valid: false,
      error: "El cuerpo de la petición debe ser un objeto JSON",
    };
  }

  const { rotated, q, r } = body;

  const isMatrix = (m) =>
    Array.isArray(m) && m.length > 0 && Array.isArray(m[0]);

  if (!isMatrix(rotated) || !isMatrix(q) || !isMatrix(r)) {
    return {
      valid: false,
      error:
        'Las matrices "rotated", "q" y "r" son obligatorias y deben tener al menos una fila y una columna',
    };
  }

  return { valid: true };
}
