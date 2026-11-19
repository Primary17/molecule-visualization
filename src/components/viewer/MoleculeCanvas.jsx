import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { MOUSE, TOUCH, Vector3 } from "three";
import ViewerHelp from "./ViewerHelp.jsx";
import { findElement } from "../../domain/elementCatalog.js";
import { centroid } from "../../domain/moleculeModel.js";
import { atomRadius, bondsVisible, framingDistance } from "../../view/viewModes.js";
import AtomSphere from "./AtomSphere.jsx";
import BondStick from "./BondStick.jsx";

const STAGE_COLOR = "#1c1916";

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function CameraRig({ distance, resetKey }) {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls);
  const seenReset = useRef(null);

  useLayoutEffect(() => {
    /* oxlint-disable react/immutability */
    const canonical = seenReset.current !== resetKey;
    seenReset.current = resetKey;
    const target = new Vector3(0, 0, 0);
    const offset = canonical
      ? new Vector3(0, distance * 0.32, distance)
      : camera.position.clone().sub(target);
    if (offset.lengthSq() < 1e-8) offset.set(0, distance * 0.32, distance);
    else offset.setLength(distance);

    camera.position.copy(target).add(offset);
    camera.near = Math.max(0.01, distance / 100);
    camera.far = Math.max(80, distance * 40);
    camera.fov = 35;
    camera.updateProjectionMatrix();
    if (controls) {
      controls.target.copy(target);
      controls.minDistance = Math.max(0.5, distance * 0.28);
      controls.maxDistance = distance * 8;
      controls.update();
    }
    /* oxlint-enable react/immutability */
  }, [camera, controls, distance, resetKey]);

  return (
    <OrbitControls
      makeDefault
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.75}
      zoomSpeed={0.75}
      mouseButtons={{ LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN }}
      touches={{ ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }}
    />
  );
}

function MoleculeScene({ model, modeId, selectedAtomId, highlightedKey, onSelectAtom }) {
  const center = useMemo(() => centroid(model.atoms), [model]);
  const atomsById = useMemo(() => new Map(model.atoms.map((atom) => [atom.id, atom])), [model]);
  const showBonds = bondsVisible(modeId);

  return (
    <group position={[-center.x, -center.y, -center.z]}>
      {showBonds
        ? model.bonds.map((bond) => {
            const atomA = atomsById.get(bond.from);
            const atomB = atomsById.get(bond.to);
            if (!atomA || !atomB) return null;
            return (
              <BondStick
                key={bond.id}
                atomA={atomA}
                atomB={atomB}
                order={bond.order}
                radiusA={atomRadius(findElement(atomA.element), modeId)}
                radiusB={atomRadius(findElement(atomB.element), modeId)}
              />
            );
          })
        : null}
      {model.atoms.map((atom) => (
        <AtomSphere
          key={atom.id}
          atom={atom}
          modeId={modeId}
          selected={atom.id === selectedAtomId}
          grouped={atom.speciesKey === highlightedKey}
          onSelect={onSelectAtom}
        />
      ))}
    </group>
  );
}

export default function MoleculeCanvas({
  model,
  modeId,
  selectedAtomId,
  highlightedKey,
  onSelectAtom,
  cameraResetKey,
  status,
}) {
  const webgl = useMemo(() => hasWebGL(), []);
  const distance = useMemo(
    () => (model ? framingDistance(model.atoms, modeId) : 8),
    [model, modeId],
  );

  useEffect(() => () => {
    document.body.style.cursor = "";
  }, []);

  return (
    <section className="stage" aria-label="Область тривимірного перегляду">
      <div className="stage__viewport">
        {webgl && model ? (
          <Canvas
            className="stage__canvas"
            camera={{ position: [0, 2, 8], fov: 35, near: 0.05, far: 200 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true }}
            onPointerMissed={() => onSelectAtom(null)}
          >
            <color attach="background" args={[STAGE_COLOR]} />
            <ambientLight intensity={0.72} />
            <hemisphereLight args={["#fff6ee", "#2a211c", 0.55]} />
            <directionalLight position={[5, 8, 7]} intensity={1.45} />
            <directionalLight position={[-6, -2, -4]} intensity={0.4} />
            <MoleculeScene
              model={model}
              modeId={modeId}
              selectedAtomId={selectedAtomId}
              highlightedKey={highlightedKey}
              onSelectAtom={onSelectAtom}
            />
            <CameraRig distance={distance} resetKey={cameraResetKey} />
          </Canvas>
        ) : (
          <div className="stage__frame">
            <p className="stage__kicker">{webgl ? "Модель" : "WebGL"}</p>
            <p className="stage__text">{stageMessage(status, webgl)}</p>
          </div>
        )}
      </div>
      <ViewerHelp />
    </section>
  );
}

function stageMessage(status, webgl) {
  if (!webgl) return "Браузер не надав контекст WebGL, тож тривимірну сцену не зібрано.";
  if (status === "loading") return "Зчитування структури…";
  if (status === "invalid") return "Модель не зібрано. Зауваження є в панелі перевірки.";
  return "Оберіть демонстраційну структуру або відкрийте JSON.";
}
