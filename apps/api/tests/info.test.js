import { jest } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";

describe("GET /info", () => {
  it("should return 200 with correct body shape", async () => {
    const res = await request(app).get("/info");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("version");
    expect(res.body).toHaveProperty("environment");
  });

  it("should return the correct API name", async () => {
    const res = await request(app).get("/info");

    expect(res.body.name).toBe("delivery-platform-lab-api");
  });

  it("should return a valid semver version", async () => {
    const res = await request(app).get("/info");

    expect(res.body.version).toMatch(/^\d+\.\d+\.\d+/);
  });

  it("should return the current NODE_ENV", async () => {
    const res = await request(app).get("/info");

    expect(res.body.environment).toBe(process.env.NODE_ENV || "development");
  });

  it("should default to 'development' when NODE_ENV is unset", async () => {
    const original = process.env.NODE_ENV;
    delete process.env.NODE_ENV;

    try {
      const res = await request(app).get("/info");
      expect(res.body.environment).toBe("development");
    } finally {
      process.env.NODE_ENV = original;
    }
  });
});
