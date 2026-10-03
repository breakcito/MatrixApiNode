import express from "express";
import cors from "cors";
import { HealthCheck } from "./cases/health.js";
import { ProcessStats } from "./cases/stats.js";

const app = express();
const port = process.env.PORT || 3001;

// CORS con restricción al cliente configurado si se define APP_CLIENT
const appClient = process.env.APP_CLIENT;
if (appClient) {
  const allowedOrigins = appClient.split(",").map((s) => s.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Permitir solicitudes sin origen (como llamadas de servidor a servidor o herramientas internas)
        // o si el origen coincide con el cliente configurado
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
          callback(null, true);
        } else {
          callback(new Error("No permitido por CORS"));
        }
      },
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    })
  );
} else {
  app.use(cors());
}

// parser json para matrices grandes (límite de 10mb)
app.use(express.json({ limit: "10mb" }));

// exigir json en peticiones POST
app.use((req, res, next) => {
  if (req.method === "POST") {
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
  const statusCode = err.status || err.statusCode || 500;
  return res.status(statusCode).json({
    error: err.message || "Error interno del servidor",
  });
});

app.listen(port, () => {
  console.log(`Node server listening on port ${port}`);
});
