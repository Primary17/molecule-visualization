import { toMoleculeModel } from "../domain/moleculeModel.js";
import { LIMITS } from "./schema.js";
import { validateDocument } from "../validation/validateDocument.js";

const LOAD_ISSUE = {
  code: "LOAD",
  path: "",
  message: "Не вдалося прочитати джерело.",
};

const SIZE_ISSUE = {
  code: "FILE_TOO_LARGE",
  path: "",
  message: "Файл більший за 1 МБ.",
};

const PARSE_ISSUE = {
  code: "JSON_PARSE",
  path: "",
  message: "Файл не є коректним JSON.",
};

export async function loadMolecule(source) {
  let payload;
  try {
    payload = await source.load();
  } catch {
    return invalid([LOAD_ISSUE]);
  }

  const parsed = parsePayload(payload);
  if (parsed.issues) return invalid(parsed.issues);

  const validation = validateDocument(parsed.document);
  if (validation.status !== "valid") return { model: null, validation };
  return { model: toMoleculeModel(parsed.document), validation };
}

function parsePayload(payload) {
  if (!payload || typeof payload !== "object") return { issues: [LOAD_ISSUE] };
  if (payload.error === "FILE_TOO_LARGE") return { issues: [SIZE_ISSUE] };
  if (typeof payload.text === "string") {
    if (new TextEncoder().encode(payload.text).byteLength > LIMITS.maxFileBytes) {
      return { issues: [SIZE_ISSUE] };
    }
    try {
      return { document: JSON.parse(payload.text) };
    } catch {
      return { issues: [PARSE_ISSUE] };
    }
  }
  if ("document" in payload) return { document: payload.document };
  return { issues: [LOAD_ISSUE] };
}

function invalid(issues) {
  return { model: null, validation: { status: "invalid", issues } };
}
