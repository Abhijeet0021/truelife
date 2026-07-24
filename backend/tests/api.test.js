/**
 * API tests — run with `npm test`.
 *
 * These cover routing, request validation, and authentication without needing
 * a live database (they exercise the paths that respond before any DB access),
 * so they run anywhere, fast, with no setup.
 */
import { test, before } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";

let app;

before(() => {
  process.env.JWT_SECRET = "test_secret";
  app = createApp();
});

const json = (payload) => (req) => req.set("Content-Type", "application/json").send(payload);

test("GET /api/health returns ok", async () => {
  const res = await request(app).get("/api/health");
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
});

test("GET /api/donations/config reports payment availability", async () => {
  const res = await request(app).get("/api/donations/config");
  assert.equal(res.status, 200);
  assert.equal(typeof res.body.enabled, "boolean");
});

test("unknown route returns 404", async () => {
  const res = await request(app).get("/api/does-not-exist");
  assert.equal(res.status, 404);
  assert.equal(res.body.ok, false);
});

test("POST /api/contact rejects invalid input", async () => {
  const res = await request(app).post("/api/contact").send({ name: "", email: "bad", message: "" });
  assert.equal(res.status, 400);
  assert.equal(res.body.ok, false);
  assert.ok(Array.isArray(res.body.errors));
});

test("POST /api/volunteers rejects invalid phone", async () => {
  const res = await request(app).post("/api/volunteers").send({
    firstName: "Asha", lastName: "K", email: "asha@x.com", phone: "123",
    skills: ["Teaching"], availability: ["Monday"], languages: ["Hindi"],
    motivation: "too short", experience: "x",
  });
  assert.equal(res.status, 400);
});

test("POST /api/donations/order rejects a zero amount", async () => {
  const res = await request(app).post("/api/donations/order").send({ amount: 0 });
  assert.equal(res.status, 400);
});

test("admin routes require a token (401 without one)", async () => {
  const res = await request(app).get("/api/admin/stats");
  assert.equal(res.status, 401);
});

test("admin routes reject a garbage token", async () => {
  const res = await request(app).get("/api/admin/contacts").set("Authorization", "Bearer nonsense");
  assert.equal(res.status, 401);
});

test("POST /api/admin/login validates the request body", async () => {
  const res = await request(app).post("/api/admin/login").send({ email: "not-an-email" });
  assert.equal(res.status, 400);
});
