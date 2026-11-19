import { useMemo } from "react";
import { groupAtoms, tintColor } from "../../domain/elementCatalog.js";

export default function AtomLegend({ atoms = [], activeKey = null, currentKey = null, onToggle }) {
  const entries = useMemo(() => groupAtoms(atoms), [atoms]);

  return (
    <section className="panel panel--legend" aria-labelledby="legend-title">
      <h2 id="legend-title" className="section-title">
        Атоми моделі
      </h2>
      {entries.length === 0 ? (
        <p className="panel__note">Список з’явиться після завантаження структури.</p>
      ) : (
        <ul className="legend">
          {entries.map((entry) => {
            const active = entry.key === activeKey;
            const current = entry.key === currentKey;
            return (
              <li key={entry.key}>
                <button
                  type="button"
                  className={["legend__item", active ? "is-active" : "", current ? "is-current" : ""].filter(Boolean).join(" ")}
                  style={{ background: tintColor(entry.color) }}
                  aria-pressed={active}
                  onClick={() => onToggle(entry.key)}
                >
                  <span className="legend__swatch" style={{ background: entry.color }} aria-hidden="true" />
                  <span className="legend__symbol">{entry.symbol}</span>
                  <span className="legend__name">{entry.name}</span>
                  <span className="legend__stats">
                    <span className="legend__stat" title="Порядковий номер елемента">
                      <span className="legend__stat-label">Номер</span>
                      <span className="legend__stat-value">{entry.atomicNumber}</span>
                    </span>
                    <span className="legend__stat" title="Кількість атомів у молекулі">
                      <span className="legend__stat-label">Кількість</span>
                      <span className="legend__stat-value">{entry.count}</span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
