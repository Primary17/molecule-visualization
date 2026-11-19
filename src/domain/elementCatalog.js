const ELEMENTS = [
  { symbol: "H", name: "Гідроген", atomicNumber: 1, mass: 1.008, covalentRadius: 0.31, vanDerWaalsRadius: 1.2, color: "#efeae4", isotopes: [
    { massNumber: 1, name: "Протій", mass: 1.007825 },
    { massNumber: 2, name: "Дейтерій", mass: 2.014102 },
    { massNumber: 3, name: "Тритій", mass: 3.016049 },
  ] },
  { symbol: "B", name: "Бор", atomicNumber: 5, mass: 10.81, covalentRadius: 0.84, vanDerWaalsRadius: 1.92, color: "#f0b4b4", isotopes: [
    { massNumber: 10, name: "Бор-10", mass: 10.012937 },
    { massNumber: 11, name: "Бор-11", mass: 11.009305 },
  ] },
  { symbol: "C", name: "Карбон", atomicNumber: 6, mass: 12.011, covalentRadius: 0.76, vanDerWaalsRadius: 1.7, color: "#8d8d8d", isotopes: [
    { massNumber: 12, name: "Карбон-12", mass: 12 },
    { massNumber: 13, name: "Карбон-13", mass: 13.003355 },
    { massNumber: 14, name: "Карбон-14", mass: 14.003242 },
  ] },
  { symbol: "N", name: "Нітроген", atomicNumber: 7, mass: 14.007, covalentRadius: 0.71, vanDerWaalsRadius: 1.55, color: "#4457d4", isotopes: [
    { massNumber: 14, name: "Нітроген-14", mass: 14.003074 },
    { massNumber: 15, name: "Нітроген-15", mass: 15.000109 },
  ] },
  { symbol: "O", name: "Оксиген", atomicNumber: 8, mass: 15.999, covalentRadius: 0.66, vanDerWaalsRadius: 1.52, color: "#e23b2f", isotopes: [
    { massNumber: 16, name: "Оксиген-16", mass: 15.994915 },
    { massNumber: 17, name: "Оксиген-17", mass: 16.999132 },
    { massNumber: 18, name: "Оксиген-18", mass: 17.99916 },
  ] },
  { symbol: "F", name: "Фтор", atomicNumber: 9, mass: 18.998, covalentRadius: 0.57, vanDerWaalsRadius: 1.47, color: "#6fbf4a", isotopes: [
    { massNumber: 18, name: "Фтор-18", mass: 18.000938 },
    { massNumber: 19, name: "Фтор-19", mass: 18.998403 },
  ] },
  { symbol: "Na", name: "Натрій", atomicNumber: 11, mass: 22.99, covalentRadius: 1.66, vanDerWaalsRadius: 2.27, color: "#ab5cf2", isotopes: [] },
  { symbol: "Mg", name: "Магній", atomicNumber: 12, mass: 24.305, covalentRadius: 1.41, vanDerWaalsRadius: 1.73, color: "#8aff00", isotopes: [] },
  { symbol: "Si", name: "Силіцій", atomicNumber: 14, mass: 28.085, covalentRadius: 1.11, vanDerWaalsRadius: 2.1, color: "#f0c8a0", isotopes: [] },
  { symbol: "P", name: "Фосфор", atomicNumber: 15, mass: 30.974, covalentRadius: 1.07, vanDerWaalsRadius: 1.8, color: "#e07a1f", isotopes: [] },
  { symbol: "S", name: "Сульфур", atomicNumber: 16, mass: 32.06, covalentRadius: 1.05, vanDerWaalsRadius: 1.8, color: "#e2d23a", isotopes: [] },
  { symbol: "Cl", name: "Хлор", atomicNumber: 17, mass: 35.45, covalentRadius: 1.02, vanDerWaalsRadius: 1.75, color: "#3dcb3d", isotopes: [
    { massNumber: 35, name: "Хлор-35", mass: 34.968853 },
    { massNumber: 37, name: "Хлор-37", mass: 36.965903 },
  ] },
  { symbol: "K", name: "Калій", atomicNumber: 19, mass: 39.098, covalentRadius: 2.03, vanDerWaalsRadius: 2.75, color: "#8f40d4", isotopes: [] },
  { symbol: "Ca", name: "Кальцій", atomicNumber: 20, mass: 40.078, covalentRadius: 1.76, vanDerWaalsRadius: 2.31, color: "#3dff00", isotopes: [] },
  { symbol: "Fe", name: "Ферум", atomicNumber: 26, mass: 55.845, covalentRadius: 1.32, vanDerWaalsRadius: 2, color: "#e06633", isotopes: [] },
  { symbol: "Zn", name: "Цинк", atomicNumber: 30, mass: 65.38, covalentRadius: 1.22, vanDerWaalsRadius: 1.39, color: "#7d80b0", isotopes: [] },
  { symbol: "Br", name: "Бром", atomicNumber: 35, mass: 79.904, covalentRadius: 1.2, vanDerWaalsRadius: 1.85, color: "#a62929", isotopes: [] },
  { symbol: "I", name: "Йод", atomicNumber: 53, mass: 126.904, covalentRadius: 1.39, vanDerWaalsRadius: 1.98, color: "#940094", isotopes: [] },
];

const BY_SYMBOL = new Map(ELEMENTS.map((element) => [element.symbol.toLowerCase(), element]));
const SUPER = "⁰¹²³⁴⁵⁶⁷⁸⁹";

export function findElement(symbol) {
  if (typeof symbol !== "string") return null;
  return BY_SYMBOL.get(symbol.trim().toLowerCase()) ?? null;
}

export function superscript(value) {
  return String(value).replace(/\d/g, (digit) => SUPER[digit]);
}

export function describeAtom(symbol, massNumber = null) {
  const element = findElement(symbol);
  if (!element) return null;
  const marked = Number.isInteger(massNumber);
  const isotope = marked ? element.isotopes.find((item) => item.massNumber === massNumber) : null;
  return {
    key: marked ? `${element.symbol}:${massNumber}` : element.symbol,
    atomicNumber: element.atomicNumber,
    color: element.color,
    symbol: marked ? `${superscript(massNumber)}${element.symbol}` : element.symbol,
    name: isotope?.name ?? (marked ? `${element.name}-${massNumber}` : element.name),
    mass: isotope?.mass ?? (marked ? massNumber : element.mass),
    massNumber: marked ? massNumber : null,
  };
}

export function speciesKey(element, massNumber) {
  return describeAtom(element, massNumber)?.key ?? element;
}

export function groupAtoms(atoms) {
  const groups = new Map();
  for (const atom of atoms) {
    const described = describeAtom(atom.element, atom.massNumber);
    if (!described) continue;
    const existing = groups.get(described.key);
    if (existing) existing.count += 1;
    else groups.set(described.key, { ...described, count: 1 });
  }
  return [...groups.values()].sort(
    (a, b) => a.atomicNumber - b.atomicNumber || (a.massNumber ?? -1) - (b.massNumber ?? -1),
  );
}

export function tintColor(hex, mix = 0.8) {
  const paper = [251, 247, 242];
  const value = Number.parseInt(hex.slice(1), 16);
  const channels = [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  const mixed = channels.map((channel, index) => Math.round(channel * (1 - mix) + paper[index] * mix));
  return `rgb(${mixed.join(" ")})`;
}
