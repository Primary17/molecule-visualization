import katex from "katex";
import "katex/contrib/mhchem";

export function renderFormulaHtml(latex) {
  return katex.renderToString(latex, {
    throwOnError: true,
    trust: false,
    strict: "ignore",
    displayMode: false,
    output: "html",
  });
}

export function formulaLabel(latex, label) {
  if (typeof label === "string" && label.trim()) return label.trim();
  const match = latex.trim().match(/^\\ce\{([\s\S]*)\}$/);
  return match ? match[1] : latex;
}
