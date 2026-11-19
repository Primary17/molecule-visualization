import { useLayoutEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Quaternion, Vector3 } from "three";
import { BOND_COLOR, BOND_OFFSET, BOND_RADIUS } from "../../view/viewModes.js";

const AXIS = new Vector3();
const START = new Vector3();
const END = new Vector3();
const ORIGIN = new Vector3();
const FINISH = new Vector3();
const VIEW = new Vector3();
const SIDE = new Vector3();
const MID = new Vector3();
const QUAT = new Quaternion();
const UP = new Vector3(0, 1, 0);
const FALLBACK = new Vector3(1, 0, 0);

function shiftsFor(order) {
  if (order === 3) return [-BOND_OFFSET, 0, BOND_OFFSET];
  if (order === 2) return [-BOND_OFFSET, BOND_OFFSET];
  return [0];
}

function placeSticks(meshes, camera, atomA, atomB, order, radiusA, radiusB) {
  START.set(atomA.position.x, atomA.position.y, atomA.position.z);
  END.set(atomB.position.x, atomB.position.y, atomB.position.z);
  AXIS.subVectors(END, START);
  const distance = AXIS.length();
  if (distance < 1e-4) return;

  AXIS.multiplyScalar(1 / distance);
  ORIGIN.copy(START).addScaledVector(AXIS, radiusA);
  FINISH.copy(END).addScaledVector(AXIS, -radiusB);
  const length = ORIGIN.distanceTo(FINISH);
  if (length < 0.04) return;

  camera.getWorldDirection(VIEW);
  SIDE.crossVectors(AXIS, VIEW);
  if (SIDE.lengthSq() < 1e-6) {
    const helper = Math.abs(AXIS.y) > 0.92 ? FALLBACK : UP;
    SIDE.crossVectors(AXIS, helper);
  }
  SIDE.normalize();
  QUAT.setFromUnitVectors(UP, AXIS);
  MID.set(
    (ORIGIN.x + FINISH.x) * 0.5,
    (ORIGIN.y + FINISH.y) * 0.5,
    (ORIGIN.z + FINISH.z) * 0.5,
  );

  const shifts = shiftsFor(order);
  meshes.forEach((mesh, index) => {
    if (!mesh) return;
    mesh.position.copy(MID).addScaledVector(SIDE, shifts[index] ?? 0);
    mesh.quaternion.copy(QUAT);
    mesh.scale.set(1, length, 1);
    mesh.visible = true;
  });
}

export default function BondStick({ atomA, atomB, order, radiusA, radiusB }) {
  const meshes = useRef([]);
  const camera = useThree((state) => state.camera);
  const count = order === 3 ? 3 : order === 2 ? 2 : 1;

  useLayoutEffect(() => {
    placeSticks(meshes.current, camera, atomA, atomB, order, radiusA, radiusB);
  }, [atomA, atomB, camera, order, radiusA, radiusB]);

  useFrame(() => {
    placeSticks(meshes.current, camera, atomA, atomB, order, radiusA, radiusB);
  });

  return Array.from({ length: count }, (_, index) => (
    <mesh
      key={index}
      ref={(node) => {
        meshes.current[index] = node;
      }}
      visible={false}
      onClick={(event) => event.stopPropagation()}
    >
      <cylinderGeometry args={[BOND_RADIUS, BOND_RADIUS, 1, 12]} />
      <meshStandardMaterial color={BOND_COLOR} roughness={0.45} metalness={0.02} />
    </mesh>
  ));
}
