const express = require("express");
const { HealthCheck } = require("./cases/health");
const { ProcessStats } = require("./cases/stats");

const app = express();
const port = process.env.PORT || 3000;

// parser json para matrices grandes
app.use(express.json({ limit: "10mb" }));

// exigir json
app.use((req, res, next) => {
  if (["POST"].includes(req.method)) {
    const contentType = req.headers["content-type"] || "";
    if (!contentType.toLowerCase().startsWith("application/json")) {
      return res.status(415).json({
        error: "El encabezado Content-Type debe ser 'application/json'",
      });
    }
  }
  next();
});

// rutas
app.get("/health", HealthCheck);
app.post("/api/stats", ProcessStats);

// manejar errores
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    error: err.message || "Error interno del servidor",
  });
});

app.listen(port, () => {
  console.log(`Node server listening on port ${port}`);
});
