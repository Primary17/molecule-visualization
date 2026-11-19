import { findElement } from "../../domain/elementCatalog.js";
import { atomRadius } from "../../view/viewModes.js";

export default function AtomSphere({ atom, modeId, selected, grouped, onSelect }) {
  const element = findElement(atom.element);
  const radius = atomRadius(element, modeId);
  const scale = selected ? 1.1 : grouped ? 1.05 : 1;
  const glow = selected ? 0.55 : grouped ? 0.28 : 0;

  return (
    <mesh
      position={[atom.position.x, atom.position.y, atom.position.z]}
      scale={scale}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(atom.id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      <sphereGeometry args={[radius, 40, 32]} />
      <meshStandardMaterial
        color={element?.color ?? "#cccccc"}
        roughness={0.38}
        metalness={0.04}
        emissive={glow ? "#d85a1a" : "#000000"}
        emissiveIntensity={glow}
      />
      {selected || grouped ? (
        <mesh scale={selected ? 1.2 : 1.12}>
          <sphereGeometry args={[radius, 28, 20]} />
          <meshBasicMaterial color="#d85a1a" transparent opacity={selected ? 0.28 : 0.16} depthWrite={false} />
        </mesh>
      ) : null}
    </mesh>
  );
}
