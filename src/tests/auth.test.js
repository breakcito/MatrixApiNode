import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { requireAuth } from "../middleware/auth.js";

const SECRET = "service-secret-go-node-key-2026";

test("requireAuth rejects missing Authorization header", () => {
  let status = null;
  let body = null;
  const req = { headers: {} };
  const res = {
    status(s) {
      status = s;
      return {
        json(b) {
          body = b;
        },
      };
    },
  };
  let calledNext = false;
  requireAuth(req, res, () => {
    calledNext = true;
  });

  assert.strictEqual(status, 401);
  assert.match(body.error, /token de autenticación no proporcionado/);
  assert.strictEqual(calledNext, false);
});

test("requireAuth rejects invalid Bearer format", () => {
  let status = null;
  let body = null;
  const req = { headers: { authorization: "Basic 12345" } };
  const res = {
    status(s) {
      status = s;
      return {
        json(b) {
          body = b;
        },
      };
    },
  };
  requireAuth(req, res, () => {});
  assert.strictEqual(status, 401);
  assert.match(body.error, /formato de autorización inválido/);
});

test("requireAuth rejects invalid token signature", () => {
  let status = null;
  let body = null;
  const badToken = jwt.sign({ sub: "attacker" }, "wrong-secret");
  const req = { headers: { authorization: `Bearer ${badToken}` } };
  const res = {
    status(s) {
      status = s;
      return {
        json(b) {
          body = b;
        },
      };
    },
  };
  requireAuth(req, res, () => {});
  assert.strictEqual(status, 401);
  assert.match(body.error, /token de autenticación inválido o expirado/);
});

test("requireAuth accepts valid token", () => {
  const token = jwt.sign({ sub: "matrix-api-go" }, SECRET, { expiresIn: "5m" });
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = {};
  let calledNext = false;
  requireAuth(req, res, () => {
    calledNext = true;
  });
  assert.strictEqual(calledNext, true);
  assert.strictEqual(req.user.sub, "matrix-api-go");
});
