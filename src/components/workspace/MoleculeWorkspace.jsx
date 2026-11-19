import AtomInfo from "../info/AtomInfo.jsx";
import AtomLegend from "../info/AtomLegend.jsx";
import MoleculeInfo from "../info/MoleculeInfo.jsx";
import MoleculeSourceBar from "../source/MoleculeSourceBar.jsx";
import ValidationReport from "../validation/ValidationReport.jsx";
import MoleculeCanvas from "../viewer/MoleculeCanvas.jsx";
import ViewerToolbar from "../viewer/ViewerToolbar.jsx";
import { useMoleculeSession } from "../../session/useMoleculeSession.js";

export default function MoleculeWorkspace() {
  const session = useMoleculeSession();

  return (
    <section className="workspace" id="workspace" aria-label="Робоча область" aria-busy={session.status === "loading"}>
      <MoleculeSourceBar
        sourceId={session.sourceId}
        sourceLabel={session.sourceId.startsWith("file:") ? session.sourceLabel : ""}
        busy={session.status === "loading"}
        onSelectDemo={session.selectDemo}
        onPickFile={session.openFile}
      />
      <div className="workspace__body">
        <div className="viewer">
          <ViewerToolbar
            viewMode={session.viewMode}
            onViewModeChange={session.setViewMode}
            canResetCamera={Boolean(session.model)}
            onResetCamera={session.resetCamera}
          />
          <MoleculeCanvas
            model={session.model}
            modeId={session.viewMode}
            selectedAtomId={session.selectedAtomId}
            highlightedKey={session.highlightedKey}
            onSelectAtom={session.selectAtom}
            cameraResetKey={session.cameraResetKey}
            status={session.status}
          />
        </div>
        <aside className="side" aria-label="Відомості про структуру">
          <MoleculeInfo molecule={session.model} />
          <AtomLegend
            atoms={session.model?.atoms ?? []}
            activeKey={session.highlightedKey}
            currentKey={session.selectedAtom?.speciesKey ?? null}
            onToggle={session.toggleHighlight}
          />
          <AtomInfo atom={session.selectedAtom} />
          <ValidationReport validation={session.validation} busy={session.status === "loading"} />
        </aside>
      </div>
    </section>
  );
}
