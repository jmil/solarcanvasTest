import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export function CameraControls() {
  const { camera } = useThree();
  
  return (
    <OrbitControls
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={10}
      maxDistance={200}
      autoRotate={false}
      autoRotateSpeed={0.5}
    />
  );
}
