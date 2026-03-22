import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import App from "../App";

describe("App", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the heading", () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("no network"));

    render(<App />);

    expect(
      screen.getByRole("heading", { name: /delivery platform lab/i }),
    ).toBeInTheDocument();
  });

  it("shows API Status: OK when health check succeeds", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ status: "ok" }), { status: 200 }),
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("API Status: OK");
    });
  });

  it("shows API Status: Unavailable when health check fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network error"));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "API Status: Unavailable",
      );
    });
  });

  it("shows API Status: Unavailable when API returns non-ok response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("Internal Server Error", { status: 500 }),
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "API Status: Unavailable",
      );
    });
  });
});
