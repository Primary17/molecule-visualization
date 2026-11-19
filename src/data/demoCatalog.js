import acetylene from "./molecules/acetylene.json" with { type: "json" };
import benzene from "./molecules/benzene.json" with { type: "json" };
import brokenBond from "./molecules/broken-bond.json" with { type: "json" };
import brokenCoordinates from "./molecules/broken-coordinates.json" with { type: "json" };
import brokenOrder from "./molecules/broken-order.json" with { type: "json" };
import ethene from "./molecules/ethene.json" with { type: "json" };
import hydrogenDeuteride from "./molecules/hydrogen-deuteride.json" with { type: "json" };
import water from "./molecules/water.json" with { type: "json" };
import atp from "./molecules/atp.json" with { type: "json" };
import glutathioneDisulfide from "./molecules/glutathione-disulfide.json" with { type: "json" };
import palmiticAcid from "./molecules/palmitic-acid.json" with { type: "json" };
import penicillinG from "./molecules/penicillin-g.json" with { type: "json" };
import riboflavin from "./molecules/riboflavin.json" with { type: "json" };

export const DEMO_MOLECULES = [
  { id: "water", label: "Вода", tone: "valid", document: water },
  { id: "hydrogen-deuteride", label: "Гідроген дейтерид", tone: "valid", document: hydrogenDeuteride },
  { id: "ethene", label: "Етен", tone: "valid", document: ethene },
  { id: "acetylene", label: "Етин", tone: "valid", document: acetylene },
  { id: "benzene", label: "Бензен", tone: "valid", document: benzene },
  { id: "palmitic-acid", label: "Пальмітинова кислота", tone: "valid", document: palmiticAcid},
  { id: "penicillin-g", label: "Бензилпеніцилін", tone: "valid", document: penicillinG},
  { id: "riboflavin", label: "Рибофлавін", tone: "valid", document: riboflavin},
  { id: "atp", label: "Аденозинтрифосфат", tone: "valid", document: atp},
  { id: "glutathione-disulfide", label: "Окиснений глутатіон", tone: "valid", document: glutathioneDisulfide},
  { id: "broken-bond", label: "Відсутній атом", tone: "invalid", document: brokenBond },
  { id: "broken-coordinates", label: "Некоректні координати", tone: "invalid", document: brokenCoordinates },
  { id: "broken-order", label: "Неприпустимий порядок", tone: "invalid", document: brokenOrder },
];

export function demoSource(id) {
  const entry = DEMO_MOLECULES.find((item) => item.id === id);
  if (!entry) return null;
  return {
    id: entry.id,
    label: entry.label,
    async load() {
      return { document: entry.document };
    },
  };
}
