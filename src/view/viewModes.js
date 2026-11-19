import { findElement } from "../domain/elementCatalog.js";
import { centroid } from "../domain/moleculeModel.js";

const BALL_STICK_SCALE = 0.42;

export function atomRadius(element, modeId) {
  if (!element) return 0.2;
  if (modeId === "space-filling") return element.vanDerWaalsRadius;
  return Math.max(0.15, element.covalentRadius * BALL_STICK_SCALE);
}

export function bondsVisible(modeId) {
  return modeId === "ball-and-stick";
}

export function framingDistance(atoms, modeId, fovDeg = 35) {
  const center = centroid(atoms);
  let reach = 0.6;
  for (const atom of atoms) {
    const radius = atomRadius(findElement(atom.element), modeId);
    const span = Math.hypot(
      atom.position.x - center.x,
      atom.position.y - center.y,
      atom.position.z - center.z,
    );
    reach = Math.max(reach, span + radius);
  }
  const half = (fovDeg * Math.PI) / 360;
  return (reach / Math.sin(half)) * 1.35;
}

export const BOND_COLOR = "#d5c7b8";
export const BOND_RADIUS = 0.032;
export const BOND_OFFSET = 0.16;

export const VIEW_MODES = [
  {
    id: "ball-and-stick",
    label: "Кульково-стрижнева",
    shortLabel: "Ball-and-stick",
    description: "Атоми — компактні сфери, зв’язки — стрижні.",
  },
  {
    id: "space-filling",
    label: "Просторова",
    shortLabel: "Space-filling",
    description: "Атоми за ван-дер-ваальсовим радіусом, без стрижнів.",
  },
];
