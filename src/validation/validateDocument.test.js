import assert from "node:assert/strict";
import test from "node:test";
import water from "../data/molecules/water.json" with { type: "json" };
import brokenBond from "../data/molecules/broken-bond.json" with { type: "json" };
import brokenCoordinates from "../data/molecules/broken-coordinates.json" with { type: "json" };
import brokenOrder from "../data/molecules/broken-order.json" with { type: "json" };
import hydrogenDeuteride from "../data/molecules/hydrogen-deuteride.json" with { type: "json" };
import { groupAtoms } from "../domain/elementCatalog.js";
import { toMoleculeModel } from "../domain/moleculeModel.js";
import { validateDocument } from "./validateDocument.js";

test("water passes and keeps three atoms", () => {
  const validation = validateDocument(water);
  assert.equal(validation.status, "valid");
  assert.equal(toMoleculeModel(water).atomCount, 3);
  assert.equal(toMoleculeModel(water).mass, 18.015);
});

test("a bond to a missing atom is rejected", () => {
  const validation = validateDocument(brokenBond);
  assert.equal(validation.status, "invalid");
  assert.ok(validation.issues.some((issue) => issue.code === "UNKNOWN_ATOM_REF"));
});

test("a string coordinate is rejected", () => {
  const validation = validateDocument(brokenCoordinates);
  assert.equal(validation.status, "invalid");
  assert.ok(validation.issues.some((issue) => issue.code === "INVALID_COORDINATE"));
});

test("bond order outside 1–3 is rejected", () => {
  const validation = validateDocument(brokenOrder);
  assert.equal(validation.status, "invalid");
  assert.ok(validation.issues.some((issue) => issue.code === "INVALID_BOND_ORDER"));
});

test("hydrogen deuteride splits protium and deuterium, water does not", () => {
  const hd = groupAtoms(toMoleculeModel(hydrogenDeuteride).atoms);
  assert.deepEqual(hd.map((item) => item.name), ["Протій", "Дейтерій"]);
  assert.equal(hd[0].color, hd[1].color);
  const waterGroups = groupAtoms(toMoleculeModel(water).atoms).map((item) => item.name);
  assert.deepEqual(waterGroups, ["Гідроген", "Оксиген"]);
});

test("an unknown element symbol is rejected", () => {
  const document = structuredClone(water);
  document.molecule.atoms[0].element = "Xx";
  const validation = validateDocument(document);
  assert.ok(validation.issues.some((issue) => issue.code === "UNKNOWN_ELEMENT"));
});
