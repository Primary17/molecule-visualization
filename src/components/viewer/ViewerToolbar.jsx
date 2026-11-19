import { VIEW_MODES } from "../../view/viewModes.js";

export default function ViewerToolbar({ viewMode, onViewModeChange, canResetCamera, onResetCamera }) {
  return (
    <div className="toolbar">
      <h2 className="section-title" id="view-mode-title">
        Режим перегляду
      </h2>
      <div className="toolbar__controls">
        <fieldset className="modes">
          <legend className="sr-only">Режим перегляду</legend>
          <div className="modes__options">
            {VIEW_MODES.map((mode) => {
              const active = mode.id === viewMode;
              return (
                <label key={mode.id} className={active ? "mode is-active" : "mode"}>
                  <input
                    type="radio"
                    name="view-mode"
                    value={mode.id}
                    checked={active}
                    onChange={() => onViewModeChange(mode.id)}
                  />
                  <span className="mode__en">{mode.shortLabel}</span>
                  <span className="mode__uk">{mode.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <button type="button" className="mode mode--reset" disabled={!canResetCamera} onClick={onResetCamera}>
          <span className="mode__en">Скинути камеру</span>
          <span className="mode__uk">Початковий ракурс</span>
        </button>
      </div>
    </div>
  );
}
