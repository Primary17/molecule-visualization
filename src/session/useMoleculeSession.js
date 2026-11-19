import { useMemo, useRef, useState } from "react";
import { fileSource } from "../data/fileSource.js";
import { demoSource } from "../data/demoCatalog.js";
import { loadMolecule } from "../data/loadMolecule.js";
import { describeAtom } from "../domain/elementCatalog.js";
import { VIEW_MODES } from "../view/viewModes.js";

export function useMoleculeSession() {
  const [status, setStatus] = useState("idle");
  const [model, setModel] = useState(null);
  const [validation, setValidation] = useState(null);
  const [sourceId, setSourceId] = useState("");
  const [sourceLabel, setSourceLabel] = useState("");
  const [viewMode, setViewMode] = useState(VIEW_MODES[0].id);
  const [selectedAtomId, setSelectedAtomId] = useState(null);
  const [highlightedKey, setHighlightedKey] = useState(null);
  const [cameraResetKey, setCameraResetKey] = useState(0);
  const requestId = useRef(0);

  async function openSource(source) {
    const current = requestId.current + 1;
    requestId.current = current;
    setStatus("loading");
    setSelectedAtomId(null);
    setHighlightedKey(null);
    setModel(null);
    setValidation(null);
    setSourceId(source.id);
    setSourceLabel(source.label);
    const result = await loadMolecule(source);
    if (requestId.current !== current) return;
    setValidation(result.validation);
    setModel(result.model);
    setStatus(result.model ? "ready" : "invalid");
    setCameraResetKey((key) => key + 1);
  }

  function selectDemo(id) {
    if (!id) {
      requestId.current += 1;
      setStatus("idle");
      setModel(null);
      setValidation(null);
      setSourceId("");
      setSourceLabel("");
      setSelectedAtomId(null);
      setHighlightedKey(null);
      return;
    }
    const source = demoSource(id);
    if (source) openSource(source);
  }

  function openFile(file) {
    if (file) openSource(fileSource(file));
  }

  function selectAtom(id) {
    setSelectedAtomId(id);
    setHighlightedKey(null);
  }

  function toggleHighlight(key) {
    setHighlightedKey((current) => (current === key ? null : key));
    setSelectedAtomId(null);
  }

  function resetCamera() {
    if (model) setCameraResetKey((key) => key + 1);
  }

  const selectedAtom = useMemo(() => {
    if (!model || !selectedAtomId) return null;
    const atom = model.atoms.find((item) => item.id === selectedAtomId);
    if (!atom) return null;
    const bonds = model.bonds
      .filter((bond) => bond.from === atom.id || bond.to === atom.id)
      .map((bond) => {
        const otherId = bond.from === atom.id ? bond.to : bond.from;
        const other = model.atoms.find((item) => item.id === otherId);
        const described = other ? describeAtom(other.element, other.massNumber) : null;
        return {
          id: bond.id,
          order: bond.order,
          otherId,
          otherSymbol: described?.symbol ?? otherId,
        };
      });
    return { ...atom, bonds };
  }, [model, selectedAtomId]);

  return {
    status,
    model,
    validation,
    sourceId,
    sourceLabel,
    viewMode,
    setViewMode,
    selectedAtomId,
    selectAtom,
    selectedAtom,
    highlightedKey,
    toggleHighlight,
    cameraResetKey,
    selectDemo,
    openFile,
    resetCamera,
  };
}
