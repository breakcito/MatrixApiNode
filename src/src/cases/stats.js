import { parseStatsRequest } from "../dto/matrix";
import { validateMatrix } from "../utils/validate";
import { calculateStats } from "../utils/stats";

export function ProcessStats(req, res) {
  // validar formato
  const parsed = parseStatsRequest(req.body);
  if (!parsed.valid) {
    return res.status(400).json({ error: parsed.error });
  }

  const { rotated, q, r } = req.body;

  // validar matrices
  try {
    validateMatrix(rotated, "rotated");
    validateMatrix(q, "q");
    validateMatrix(r, "r");
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  // calcular estadisticas de cada matriz
  const stats = calculateStats([rotated, q, r]);

  return res.status(200).json(stats);
}
