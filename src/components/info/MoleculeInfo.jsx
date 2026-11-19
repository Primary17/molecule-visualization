import Formula from "../formula/Formula.jsx";

const FACTS = [
  { key: "name", label: "Назва" },
  { key: "formula", label: "Формула" },
  { key: "atomCount", label: "Атоми" },
  { key: "bondCount", label: "Зв’язки" },
  { key: "mass", label: "Маса" },
];

function factValue(molecule, key) {
  if (!molecule) return "—";
  if (key === "formula") return <Formula latex={molecule.formula} />;
  if (key === "mass") return `${molecule.mass.toFixed(3)} а.о.м.`;
  return molecule[key];
}

export default function MoleculeInfo({ molecule = null }) {
  return (
    <section className="panel panel--molecule" aria-labelledby="molecule-info-title">
      <h2 id="molecule-info-title" className="section-title">
        Молекула
      </h2>
      {molecule ? null : <p className="panel__note">Структуру ще не обрано.</p>}
      <dl className="facts">
        {FACTS.map((fact) => (
          <div key={fact.key}>
            <dt>{fact.label}</dt>
            <dd>{factValue(molecule, fact.key)}</dd>
          </div>
        ))}
      </dl>
      {molecule?.description ? <p className="panel__note">{molecule.description}</p> : null}
    </section>
  );
}
