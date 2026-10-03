import jwt from "jsonwebtoken";

// requireAuth valida que la petición contenga un JWT válido en el encabezado Authorization
export function requireAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({
      error: "token de autenticación no proporcionado",
    });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return res.status(401).json({
      error: "formato de autorización inválido. Debe ser 'Bearer <token>'",
    });
  }

  const token = parts[1].trim();
  const secret =
    process.env.STATS_JWT_SECRET ||
    process.env.JWT_SECRET ||
    "service-secret-go-node-key-2026";

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "token de autenticación inválido o expirado",
      detail: err.message,
    });
  }
}
