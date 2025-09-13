import { useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { PaperData } from "../../../shared/research-types";

interface PublicationPlanetProps {
  publication: PaperData;
  position: [number, number, number];
  onClick: () => void;
  scale?: number;
}

export function PublicationPlanet({ publication, position, onClick, scale = 1 }: PublicationPlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Calculate planet size based on citation count and recency
  const currentYear = new Date().getFullYear();
  const age = currentYear - publication.year;
  const recencyFactor = Math.max(0.3, 1 - (age / 20)); // Newer papers slightly larger
  
  const baseSize = 0.3;
  const maxSize = 1.5;
  const citationFactor = Math.min(publication.citationCount / 100, 1);
  const size = (baseSize + (citationFactor * (maxSize - baseSize))) * recencyFactor * scale;
  
  // Purple color variations based on publication type/impact
  const getPurpleShade = () => {
    if (publication.citationCount > 50) return "#9932CC"; // Dark orchid for high impact
    if (publication.citationCount > 10) return "#8A2BE2"; // Blue violet for medium impact
    return "#DA70D6"; // Orchid for newer publications
  };

  useFrame((state) => {
    // Planet rotation
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.01;
      
      // Subtle pulsing based on citation count
      const pulseFactor = 1 + Math.sin(state.clock.elapsedTime * 1.5 + position[2]) * 0.05 * citationFactor;
      planetRef.current.scale.setScalar(pulseFactor);
    }
    
    // Glow effect for highly cited papers
    if (glowRef.current && publication.citationCount > 20) {
      const glowIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      glowRef.current.material.opacity = glowIntensity * 0.3;
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
      {/* Main planet */}
      <mesh
        ref={planetRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        scale={hovered ? size * 1.2 : size}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshLambertMaterial 
          color={getPurpleShade()}
          emissive={getPurpleShade()}
          emissiveIntensity={0.3 + citationFactor * 0.2}
        />
        
        {/* Purple light emanating from planet */}
        <pointLight 
          intensity={0.5 + citationFactor * 1.5} 
          color={getPurpleShade()}
          distance={15}
          decay={2}
        />
      </mesh>
      
      {/* Glow effect for highly cited papers */}
      {publication.citationCount > 20 && (
        <mesh
          ref={glowRef}
          position={[0, 0, 0]}
        >
          <sphereGeometry args={[1.3, 16, 16]} />
          <meshBasicMaterial 
            color={getPurpleShade()}
            transparent
            opacity={0.2}
          />
        </mesh>
      )}
      
      {/* Publication year indicator ring */}
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[size + 0.2, size + 0.3, 16]} />
        <meshBasicMaterial 
          color={age < 5 ? "#00FF00" : age < 10 ? "#FFFF00" : "#FF6600"}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Title label on hover */}
      {hovered && (
        <group position={[0, size + 1.5, 0]}>
          <mesh>
            <planeGeometry args={[8, 1.5]} />
            <meshBasicMaterial 
              color="#000000" 
              transparent 
              opacity={0.9}
            />
          </mesh>
        </group>
      )}
      
      {/* Author count indicators (small orbiting dots) */}
      {publication.authors.slice(0, Math.min(5, publication.authors.length)).map((author, index) => {
        const orbitRadius = size + 1 + index * 0.3;
        const angle = (index / publication.authors.length) * Math.PI * 2;
        return (
          <mesh
            key={`${publication.pmid}-author-${index}`}
            position={[
              Math.cos(angle) * orbitRadius,
              0,
              Math.sin(angle) * orbitRadius
            ]}
          >
            <sphereGeometry args={[0.08, 6, 6]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
        );
      })}
    </group>
  );
}