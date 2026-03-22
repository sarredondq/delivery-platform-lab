import cors from "cors";
import express from "express";
import healthRouter from "./routes/health.js";
import infoRouter from "./routes/info.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(healthRouter);
app.use(infoRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
