import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import "@fontsource/inter";
import { SolarSystem } from "./components/SolarSystem";
import { SolarSystem2D } from "./components/SolarSystem2D";
import { PlanetInfoPanel } from "./components/PlanetInfoPanel";
import { CameraControls } from "./components/CameraControls";
import type { PlanetData } from "./data/planetData";

// Simplified WebGL detection
function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    console.warn('WebGL detection failed:', e);
    return false;
  }
}

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [canvasError, setCanvasError] = useState<string | null>(null);

  useEffect(() => {
    setWebglSupported(isWebGLSupported());
  }, []);

  // Error handler for Canvas
  const handleCanvasError = (error: any) => {
    console.error('Canvas error:', error);
    setCanvasError('Unable to initialize 3D graphics. Please try refreshing the page or using a different browser.');
  };

  // Use 2D fallback if WebGL isn't supported or if there's a canvas error
  if (!webglSupported || canvasError) {
    return (
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <SolarSystem2D onPlanetClick={setSelectedPlanet} />
        
        {/* UI Overlay */}
        <PlanetInfoPanel 
          planet={selectedPlanet} 
          onClose={() => setSelectedPlanet(null)} 
        />
        
        {/* Instructions */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-xs">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-bold">Solar System Explorer</h3>
            <div className="ml-2 flex items-center">
              {(!webglSupported || canvasError) ? (
                <span className="text-blue-400 text-sm" title="2D Mode">🖼️</span>
              ) : (
                <span className="text-green-400 text-sm" title="3D Mode">🎮</span>
              )}
            </div>
          </div>
          <p className="text-sm mb-2">Click on planets to learn more about them</p>
          {(!webglSupported || canvasError) && (
            <p className="text-xs text-yellow-300 mt-2">
              2D Mode - Accessibility Optimized
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Canvas
        shadows
        camera={{
          position: [0, 10, 20],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: false,
          powerPreference: "default",
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: false,
          alpha: false,
          depth: true,
          stencil: false,
          premultipliedAlpha: true
        }}
        onCreated={(state) => {
          console.log('Canvas created successfully');
        }}
        onError={handleCanvasError}
      >
        <color attach="background" args={["#1a0a2e"]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />
        
        <Suspense fallback={null}>
          <SolarSystem onPlanetClick={setSelectedPlanet} />
          <CameraControls />
        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      <PlanetInfoPanel 
        planet={selectedPlanet} 
        onClose={() => setSelectedPlanet(null)} 
      />
      
      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-xs">
        <div className="flex items-center mb-2">
          <h3 className="text-lg font-bold">Solar System Explorer</h3>
          <div className="ml-2 flex items-center">
            <span className="text-green-400 text-sm" title="3D Mode">🎮</span>
          </div>
        </div>
        <p className="text-sm mb-2">Click on planets to learn more about them</p>
        <p className="text-xs text-gray-300">
          Use mouse to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
}

export default App;
