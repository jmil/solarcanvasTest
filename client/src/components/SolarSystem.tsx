import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Planet } from "./Planet";
import { planetsData, type PlanetData } from "../data/planetData";

interface SolarSystemProps {
  onPlanetClick: (planet: PlanetData) => void;
}

export function SolarSystem({ onPlanetClick }: SolarSystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      // Slow rotation of the entire system for visual effect
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Purple space atmosphere sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[500, 32, 32]} />
        <meshBasicMaterial 
          color="#2A0845" 
          side={THREE.BackSide}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Sun */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color="#FDB813" />
        <pointLight intensity={2} color="#FDB813" />
      </mesh>
      
      {/* Sun glow effect */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial 
          color="#FDB813" 
          transparent 
          opacity={0.1}
        />
      </mesh>
      
      {/* Planets */}
      {planetsData.map((planetData, index) => (
        <Planet
          key={planetData.name}
          planetData={planetData}
          onClick={() => onPlanetClick(planetData)}
        />
      ))}
      
      {/* Orbital paths */}
      {planetsData.map((planetData, index) => (
        <mesh key={`orbit-${planetData.name}`} rotation-x={Math.PI / 2}>
          <ringGeometry args={[planetData.distance - 0.05, planetData.distance + 0.05, 64]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
