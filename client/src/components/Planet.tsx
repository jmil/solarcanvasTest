import { useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { type PlanetData } from "../data/planetData";

interface PlanetProps {
  planetData: PlanetData;
  onClick: () => void;
}

export function Planet({ planetData, onClick }: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [orbitAngle, setOrbitAngle] = useState(Math.random() * Math.PI * 2);

  useFrame(() => {
    // Orbit around the sun
    if (orbitRef.current) {
      setOrbitAngle(prev => prev + planetData.orbitSpeed * 0.01);
      orbitRef.current.position.x = Math.cos(orbitAngle) * planetData.distance;
      orbitRef.current.position.z = Math.sin(orbitAngle) * planetData.distance;
    }
    
    // Planet rotation
    if (planetRef.current) {
      planetRef.current.rotation.y += planetData.rotationSpeed * 0.01;
    }
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onClick();
  };

  const handlePointerOver = () => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group ref={orbitRef}>
      <mesh
        ref={planetRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        scale={hovered ? planetData.size * 1.2 : planetData.size}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshLambertMaterial 
          color={planetData.color}
          emissive={hovered ? planetData.color : "#000000"}
          emissiveIntensity={hovered ? 0.1 : 0}
        />
      </mesh>
      
      {/* Planet label */}
      <mesh position={[0, planetData.size + 1, 0]}>
        <planeGeometry args={[4, 0.8]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={hovered ? 0.8 : 0.6}
        />
      </mesh>
      
      {/* Add rings for Saturn */}
      {planetData.name === "Saturn" && (
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry args={[1.5, 2.5, 32]} />
          <meshLambertMaterial 
            color="#C4A484" 
            transparent 
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
