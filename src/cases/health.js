export function HealthCheck(req, res) {
  return res.status(200).json({ status: "healthy" });
}
