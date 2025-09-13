import { useMemo } from "react";
import * as THREE from "three";

export function StarField() {
  const stars = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    
    for (let i = 0; i < 2000; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 400;
      positions[i3 + 1] = (Math.random() - 0.5) * 400;
      positions[i3 + 2] = (Math.random() - 0.5) * 400;
    }
    
    return positions;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={stars.length / 3}
          array={stars}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#ffffff" 
        size={1} 
        sizeAttenuation={false}
      />
    </points>
  );
}
