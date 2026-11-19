import { useState } from "react";

const ORDER_LABEL = {
  1: "одинарний",
  2: "подвійний",
  3: "потрійний",
};

export default function AtomInfo({ atom = null }) {
  const [showIndices, setShowIndices] = useState(false);

  return (
    <section className="panel panel--bonds" aria-labelledby="atom-info-title">
      <div className="panel__heading">
        <h2 id="atom-info-title" className="section-title">
          Зв’язки атома
        </h2>
        <label className="check">
          <input
            type="checkbox"
            checked={showIndices}
            onChange={(event) => setShowIndices(event.target.checked)}
          />
          Індекси
        </label>
      </div>
      {atom ? (
        atom.bonds.length === 0 ? (
          <p className="panel__note">Зв’язків немає.</p>
        ) : (
          <ul className="atom-bonds">
            {atom.bonds.map((bond) => (
              <li key={bond.id}>
                {bond.otherSymbol}
                {showIndices ? ` · ${bond.otherId}` : ""} · {ORDER_LABEL[bond.order] ?? bond.order}
              </li>
            ))}
          </ul>
        )
      ) : (
        <p className="panel__note">Оберіть атом на моделі, щоб побачити його зв’язки.</p>
      )}
    </section>
  );
}
