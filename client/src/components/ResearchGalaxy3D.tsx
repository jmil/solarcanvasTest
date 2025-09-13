import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ResearcherStar } from "./ResearcherStar";
import { PublicationPlanet } from "./PublicationPlanet";
import type { ResearchNetworkData } from "../../../shared/research-types";

interface ResearchGalaxy3DProps {
  networkData: ResearchNetworkData;
  onResearcherClick: (researcher: any) => void;
  onPublicationClick: (publication: any) => void;
}

export function ResearchGalaxy3D({ 
  networkData, 
  onResearcherClick, 
  onPublicationClick 
}: ResearchGalaxy3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [viewMode, setViewMode] = useState<'researchers' | 'publications'>('researchers');
  
  useFrame(() => {
    if (groupRef.current) {
      // Slow rotation of the entire galaxy
      groupRef.current.rotation.y += 0.0005;
    }
  });

  // Position researchers/publications in a spiral galaxy formation
  const getGalaxyPosition = (index: number, total: number, radiusBase: number = 15) => {
    const angle = (index / total) * Math.PI * 6; // Multiple spirals
    const radius = radiusBase + (index / total) * 25;
    const height = (Math.random() - 0.5) * 8;
    
    return [
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    ] as [number, number, number];
  };

  return (
    <group ref={groupRef}>
      {/* Purple space nebula atmosphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[200, 32, 32]} />
        <meshBasicMaterial 
          color="#1a0a2e" 
          side={THREE.BackSide}
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Galaxy core (central bright light) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent
          opacity={0.8}
        />
        <pointLight intensity={1} color="#ffffff" position={[0, 0, 0]} />
      </mesh>
      
      {/* Researchers as Stars */}
      {viewMode === 'researchers' && networkData.researchers.map((researcher, index) => (
        <ResearcherStar
          key={`researcher-${researcher.name}`}
          researcher={researcher}
          position={getGalaxyPosition(index, networkData.researchers.length, 20)}
          onClick={() => onResearcherClick(researcher)}
        />
      ))}
      
      {/* Publications as Purple Planets */}
      {viewMode === 'publications' && networkData.publications.map((publication, index) => (
        <PublicationPlanet
          key={`publication-${publication.pmid}`}
          publication={publication}
          position={getGalaxyPosition(index, networkData.publications.length, 15)}
          onClick={() => onPublicationClick(publication)}
        />
      ))}
      
      {/* Mixed view - both researchers and publications */}
      {viewMode === 'researchers' && networkData.publications.slice(0, 5).map((publication, index) => (
        <PublicationPlanet
          key={`mixed-publication-${publication.pmid}`}
          publication={publication}
          position={getGalaxyPosition(
            index + networkData.researchers.length, 
            networkData.researchers.length + 5, 
            12
          )}
          onClick={() => onPublicationClick(publication)}
          scale={0.6} // Smaller in researcher view
        />
      ))}
      
      {/* View mode toggle UI embedded in 3D space */}
      <group position={[-30, 15, 0]}>
        <mesh
          position={[0, 0, 0]}
          onClick={() => setViewMode(viewMode === 'researchers' ? 'publications' : 'researchers')}
        >
          <planeGeometry args={[8, 2]} />
          <meshBasicMaterial 
            color={viewMode === 'researchers' ? "#FFD700" : "#8A2BE2"}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
    </group>
  );
}