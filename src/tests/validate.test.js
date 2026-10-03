import test from "node:test";
import assert from "node:assert/strict";
import { validateMatrix } from "../utils/validate.js";
import { parseStatsRequest } from "../dto/matrix.js";
import { calculateStats } from "../utils/stats.js";

test("validateMatrix rejects non-number with distinct message", () => {
  assert.throws(
    () => validateMatrix([["a"]], "rotated"),
    /La matriz "rotated" contiene un valor no numérico en \[0\]\[0\]/
  );
});

test("validateMatrix rejects NaN with specific NaN message", () => {
  assert.throws(
    () => validateMatrix([[NaN]], "rotated"),
    /La matriz "rotated" contiene NaN en \[0\]\[0\]/
  );
});

test("validateMatrix rejects Infinity", () => {
  assert.throws(
    () => validateMatrix([[Infinity]], "rotated"),
    /La matriz "rotated" contiene Infinito en \[0\]\[0\]/
  );
});

test("validateMatrix rejects empty matrix or empty rows [[]]", () => {
  assert.throws(
    () => validateMatrix([], "rotated"),
    /La matriz "rotated" no puede estar vacía/
  );
  assert.throws(
    () => validateMatrix([[]], "rotated"),
    /Las filas de la matriz "rotated" no pueden estar vacías/
  );
});

test("parseStatsRequest rejects [[]]", () => {
  const result = parseStatsRequest({
    rotated: [[]],
    q: [[1]],
    r: [[1]],
  });
  assert.strictEqual(result.valid, false);
});

test("calculateStats handles clean matrices and detects diagonal", () => {
  const rotated = [
    [1, 2],
    [3, 4],
  ];
  const q = [
    [1, 0],
    [0, 1],
  ];
  const r = [
    [2, 3],
    [0, 5],
  ];
  const stats = calculateStats([rotated, q, r]);
  assert.strictEqual(stats.minValue, 0);
  assert.strictEqual(stats.maxValue, 5);
  assert.strictEqual(stats.hasDiagonalMat, true); // q is identity (diagonal)
  assert.strictEqual(stats.totalSum, 1+2+3+4 + 1+0+0+1 + 2+3+0+5);
});
