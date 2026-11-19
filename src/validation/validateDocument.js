import { findElement } from "../domain/elementCatalog.js";
import { renderFormulaHtml } from "../domain/renderFormula.js";
import { COORDINATE_UNIT, DOCUMENT_FORMAT, DOCUMENT_VERSION, LIMITS } from "../data/schema.js";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function readId(value) {
  if (typeof value !== "string") return "";
  const id = value.trim();
  if (!id || id.length > LIMITS.idLength) return "";
  return id;
}

export function validateDocument(document) {
  const issues = [];
  let dropped = false;
  const push = (code, path, message) => {
    if (issues.length >= LIMITS.maxIssues) {
      dropped = true;
      return;
    }
    issues.push({ code, path, message });
  };

  if (!isPlainObject(document)) {
    push("ROOT_TYPE", "", "Корінь документа має бути об’єктом JSON.");
    return result(issues, dropped);
  }

  if (document.format !== DOCUMENT_FORMAT) {
    push("UNSUPPORTED_FORMAT", "format", "Поле format має дорівнювати molecule-structure.");
  }
  if (document.version !== DOCUMENT_VERSION) {
    push("UNSUPPORTED_VERSION", "version", "Підтримується лише версія 1.0.");
  }
  if (document.coordinateUnit !== COORDINATE_UNIT) {
    push("UNSUPPORTED_UNIT", "coordinateUnit", "Координати приймаються лише в ангстремах.");
  }

  const molecule = document.molecule;
  if (!isPlainObject(molecule)) {
    push("MISSING_FIELD", "molecule", "Об’єкт molecule відсутній.");
    return result(issues, dropped);
  }

  requireText(molecule.id, "molecule.id", 1, LIMITS.idLength, "Ідентифікатор молекули", push);
  requireText(molecule.name, "molecule.name", 1, LIMITS.nameLength, "Назва молекули", push);
  requireText(molecule.formula, "molecule.formula", 1, LIMITS.formulaLength, "Формула", push);
  if (typeof molecule.formula === "string" && molecule.formula.trim() && molecule.formula.length <= LIMITS.formulaLength) {
    try {
      renderFormulaHtml(molecule.formula);
    } catch {
      push("INVALID_FORMULA", "molecule.formula", "Формулу не вдалося розібрати як LaTeX.");
    }
  }
  if (molecule.description !== undefined && molecule.description !== null) {
    requireText(molecule.description, "molecule.description", 0, LIMITS.descriptionLength, "Опис", push);
  }

  const atomIds = new Set();
  if (!Array.isArray(molecule.atoms)) {
    push("INVALID_TYPE", "molecule.atoms", "Список атомів має бути масивом.");
  } else if (molecule.atoms.length === 0) {
    push("EMPTY_VALUE", "molecule.atoms", "У молекулі має бути щонайменше один атом.");
  } else if (molecule.atoms.length > LIMITS.maxAtoms) {
    push("TOO_MANY_ATOMS", "molecule.atoms", `Атомів більше за ${LIMITS.maxAtoms}.`);
  } else {
    molecule.atoms.forEach((atom, index) => {
      const path = `molecule.atoms[${index}]`;
      if (!isPlainObject(atom)) {
        push("INVALID_TYPE", path, "Атом має бути об’єктом.");
        return;
      }
      const id = readId(atom.id);
      if (!id) {
        push("INVALID_TYPE", `${path}.id`, "Ідентифікатор атома має бути непорожнім рядком до 64 символів.");
      } else if (atomIds.has(id)) {
        push("DUPLICATE_ATOM_ID", `${path}.id`, `Ідентифікатор атома «${id}» повторюється.`);
      } else {
        atomIds.add(id);
      }
      if (!findElement(atom.element)) {
        push("UNKNOWN_ELEMENT", `${path}.element`, "Символ елемента відсутній у довіднику.");
      }
      if (atom.isotope !== undefined && atom.isotope !== null && (!Number.isInteger(atom.isotope) || atom.isotope < 1 || atom.isotope > 300)) {
        push("INVALID_ISOTOPE", `${path}.isotope`, "Номер маси ізотопу має бути цілим числом від 1 до 300.");
      }
      if (!isPlainObject(atom.position)) {
        push("INVALID_TYPE", `${path}.position`, "Координати мають містити числові x, y і z.");
        return;
      }
      for (const axis of ["x", "y", "z"]) {
        const value = atom.position[axis];
        if (typeof value !== "number" || !Number.isFinite(value) || Math.abs(value) > LIMITS.coordLimit) {
          push(
            "INVALID_COORDINATE",
            `${path}.position.${axis}`,
            `Координата ${axis} має бути скінченним числом у межах ±${LIMITS.coordLimit}.`,
          );
        }
      }
    });
  }

  if (!Array.isArray(molecule.bonds)) {
    push("INVALID_TYPE", "molecule.bonds", "Список зв’язків має бути масивом.");
  } else if (molecule.bonds.length > LIMITS.maxBonds) {
    push("TOO_MANY_BONDS", "molecule.bonds", `Зв’язків більше за ${LIMITS.maxBonds}.`);
  } else {
    const bondIds = new Set();
    const pairs = new Set();
    molecule.bonds.forEach((bond, index) => {
      const path = `molecule.bonds[${index}]`;
      if (!isPlainObject(bond)) {
        push("INVALID_TYPE", path, "Зв’язок має бути об’єктом.");
        return;
      }
      const id = readId(bond.id);
      if (!id) {
        push("INVALID_TYPE", `${path}.id`, "Ідентифікатор зв’язку має бути непорожнім рядком до 64 символів.");
      } else if (bondIds.has(id)) {
        push("DUPLICATE_BOND_ID", `${path}.id`, `Ідентифікатор зв’язку «${id}» повторюється.`);
      } else {
        bondIds.add(id);
      }

      const from = typeof bond.from === "string" ? bond.from.trim() : "";
      const to = typeof bond.to === "string" ? bond.to.trim() : "";
      if (!from || !atomIds.has(from)) {
        push("UNKNOWN_ATOM_REF", `${path}.from`, "Зв’язок посилається на відсутній атом.");
      }
      if (!to || !atomIds.has(to)) {
        push("UNKNOWN_ATOM_REF", `${path}.to`, "Зв’язок посилається на відсутній атом.");
      }
      if (from && from === to) {
        push("SELF_BOND", path, "Зв’язок не може з’єднувати атом сам із собою.");
      }
      if (from && to && from !== to) {
        const pair = [from, to].sort().join("\0");
        if (pairs.has(pair)) push("DUPLICATE_BOND", path, "Ця пара атомів уже з’єднана.");
        else pairs.add(pair);
      }
      if (bond.order !== 1 && bond.order !== 2 && bond.order !== 3) {
        push("INVALID_BOND_ORDER", `${path}.order`, "Порядок зв’язку може бути лише 1, 2 або 3.");
      }
    });
  }

  return result(issues, dropped);
}

function requireText(value, path, min, max, label, push) {
  if (typeof value !== "string") {
    push("INVALID_TYPE", path, `${label} має бути рядком.`);
    return;
  }
  if (value.trim().length < min) {
    push("EMPTY_VALUE", path, `${label} не може бути порожнім.`);
  }
  if (value.length > max) {
    push("INVALID_TYPE", path, `${label} довша за ${max} символів.`);
  }
}

function result(issues, dropped) {
  if (dropped) {
    issues.push({
      code: "TRUNCATED",
      path: "",
      message: `Показано перші ${LIMITS.maxIssues} зауважень.`,
    });
  }
  return { status: issues.length === 0 ? "valid" : "invalid", issues };
}
