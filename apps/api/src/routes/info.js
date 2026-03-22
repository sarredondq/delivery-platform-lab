import { Router } from "express";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(join(__dirname, "../../package.json"), "utf-8"),
);

const router = Router();

router.get("/info", (_req, res) => {
  res.json({
    name: "delivery-platform-lab-api",
    version: pkg.version,
    environment: process.env.NODE_ENV || "development",
  });
});

export default router;
