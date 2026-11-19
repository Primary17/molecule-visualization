import { useMemo } from "react";
import { formulaLabel, renderFormulaHtml } from "../../domain/renderFormula.js";

const MAX_LATEX_LENGTH = 300;

export default function Formula({ latex, label }) {
  const rendered = useMemo(() => {
    if (typeof latex !== "string" || latex.trim() === "") return { state: "empty" };
    if (latex.length > MAX_LATEX_LENGTH) return { state: "invalid", latex };

    try {
      return {
        state: "ready",
        html: renderFormulaHtml(latex),
        label: formulaLabel(latex, label),
      };
    } catch {
      return { state: "invalid", latex };
    }
  }, [latex, label]);

  if (rendered.state === "empty") {
    return <span className="formula formula--empty">—</span>;
  }

  if (rendered.state === "invalid") {
    return (
      <span className="formula formula--fallback">
        <span className="sr-only">Формулу не вдалося відобразити. </span>
        <code>{rendered.latex}</code>
      </span>
    );
  }

  return (
    <span className="formula">
      <span className="sr-only">{rendered.label}</span>
      <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: rendered.html }} />
    </span>
  );
}
