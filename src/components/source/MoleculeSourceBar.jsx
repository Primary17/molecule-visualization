import { useRef } from "react";
import { DEMO_MOLECULES } from "../../data/demoCatalog.js";

const GROUPS = [
  { tone: "valid", label: "Коректні структури" },
  { tone: "invalid", label: "Навмисні помилки" },
];

export default function MoleculeSourceBar({ sourceId, sourceLabel, busy, onSelectDemo, onPickFile }) {
  const inputRef = useRef(null);
  const demoSelected = DEMO_MOLECULES.some((item) => item.id === sourceId);

  return (
    <section className="source" aria-labelledby="source-title">
      <div className="source__copy">
        <h2 id="source-title" className="section-title">
          Джерело
        </h2>
        <p>{sourceLabel || "Демонстраційний набір або власний JSON."}</p>
      </div>
      <div className="source__controls">
        <label className="field">
          <span>Демонстраційна структура</span>
          <select
            value={demoSelected ? sourceId : ""}
            disabled={busy}
            onChange={(event) => onSelectDemo(event.target.value)}
          >
            <option value="">Оберіть структуру</option>
            {GROUPS.map((group) => (
              <optgroup key={group.tone} label={group.label}>
                {DEMO_MOLECULES.filter((item) => item.tone === group.tone).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <button type="button" className="button" disabled={busy} onClick={() => inputRef.current?.click()}>
          Відкрити JSON
        </button>
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept="application/json,.json"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) onPickFile(file);
          }}
        />
      </div>
    </section>
  );
}
