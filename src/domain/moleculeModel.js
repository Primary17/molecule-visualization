import { describeAtom, findElement } from "./elementCatalog.js";

export function toMoleculeModel(document) {
  const molecule = document.molecule;
  const atoms = molecule.atoms.map((atom) => {
    const element = findElement(atom.element);
    const massNumber = Number.isInteger(atom.isotope) ? atom.isotope : null;
    const described = describeAtom(element.symbol, massNumber);
    return {
      id: atom.id.trim(),
      element: element.symbol,
      elementName: described.name,
      massNumber,
      speciesKey: described.key,
      position: {
        x: atom.position.x,
        y: atom.position.y,
        z: atom.position.z,
      },
    };
  });
  const bonds = molecule.bonds.map((bond) => ({
    id: bond.id.trim(),
    from: bond.from.trim(),
    to: bond.to.trim(),
    order: bond.order,
  }));
  const mass = atoms.reduce((sum, atom) => sum + describeAtom(atom.element, atom.massNumber).mass, 0);

  return {
    id: molecule.id.trim(),
    name: molecule.name.trim(),
    formula: molecule.formula.trim(),
    description: typeof molecule.description === "string" ? molecule.description.trim() : "",
    atoms,
    bonds,
    atomCount: atoms.length,
    bondCount: bonds.length,
    mass: Math.round(mass * 1000) / 1000,
  };
}

export function centroid(atoms) {
  const total = atoms.reduce(
    (sum, atom) => ({
      x: sum.x + atom.position.x,
      y: sum.y + atom.position.y,
      z: sum.z + atom.position.z,
    }),
    { x: 0, y: 0, z: 0 },
  );
  const count = atoms.length || 1;
  return { x: total.x / count, y: total.y / count, z: total.z / count };
}
