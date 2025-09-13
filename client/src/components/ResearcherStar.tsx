import { useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { ResearcherData } from "../../../shared/research-types";

interface ResearcherStarProps {
  researcher: ResearcherData;
  position: [number, number, number];
  onClick: () => void;
}

export function ResearcherStar({ researcher, position, onClick }: ResearcherStarProps) {
  const starRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Calculate star size and intensity based on citation count
  const baseSize = 0.5;
  const maxSize = 2.5;
  const size = baseSize + (researcher.starIntensity * (maxSize - baseSize));
  const glowSize = size * 2.5;
  
  // Color based on research impact
  const getStarColor = () => {
    if (researcher.totalCitations > 500) return "#FFD700"; // Gold for high impact
    if (researcher.totalCitations > 100) return "#FFA500"; // Orange for medium impact
    return "#FFFF00"; // Yellow for newer researchers
  };

  useFrame((state) => {
    // Star pulsing animation based on citation intensity
    if (starRef.current) {
      const pulseFactor = 1 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1 * researcher.starIntensity;
      starRef.current.scale.setScalar(pulseFactor);
    }
    
    // Glow effect
    if (glowRef.current) {
      const glowPulse = 0.7 + Math.sin(state.clock.elapsedTime * 1.5 + position[1]) * 0.3;
      glowRef.current.scale.setScalar(glowPulse);
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
    <group position={position}>
      {/* Main star */}
      <mesh
        ref={starRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        scale={hovered ? size * 1.3 : size}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color={getStarColor()}
          emissive={getStarColor()}
          emissiveIntensity={0.5 + researcher.starIntensity * 0.5}
        />
        {/* Point light emanating from star */}
        <pointLight 
          intensity={1 + researcher.starIntensity * 2} 
          color={getStarColor()}
          distance={20}
          decay={2}
        />
      </mesh>
      
      {/* Star glow effect */}
      <mesh
        ref={glowRef}
        position={[0, 0, 0]}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color={getStarColor()}
          transparent
          opacity={0.2 + researcher.starIntensity * 0.3}
        />
      </mesh>
      
      {/* Researcher name label */}
      {hovered && (
        <group position={[0, size + 2, 0]}>
          <mesh>
            <planeGeometry args={[6, 1.2]} />
            <meshBasicMaterial 
              color="#000000" 
              transparent 
              opacity={0.8}
            />
          </mesh>
          {/* Text would need a text rendering solution like @react-three/drei Text */}
        </group>
      )}
      
      {/* Orbiting publication indicators */}
      {researcher.papers.slice(0, 3).map((paper, index) => {
        const orbitRadius = size + 2 + index * 0.5;
        const angle = (index / 3) * Math.PI * 2;
        return (
          <mesh
            key={paper.pmid}
            position={[
              Math.cos(angle) * orbitRadius,
              0,
              Math.sin(angle) * orbitRadius
            ]}
          >
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#8A2BE2" />
          </mesh>
        );
      })}
    </group>
  );
}