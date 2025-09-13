import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import "@fontsource/inter";
import { SolarSystem } from "./components/SolarSystem";
import { PlanetInfoPanel } from "./components/PlanetInfoPanel";
import { CameraControls } from "./components/CameraControls";
import type { PlanetData } from "./data/planetData";

// Simplified WebGL detection - let Three.js handle the heavy lifting
function isWebGLSupported(): boolean {
  try {
    // More forgiving detection - just check if the basic WebGL context methods exist
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext || window.WebGL2RenderingContext);
  } catch (e) {
    console.warn('WebGL detection failed:', e);
    return true; // Be optimistic and let Three.js try
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

  if (!webglSupported) {
    return (
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#000011' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black bg-opacity-90 text-white p-8 rounded-lg max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">WebGL Not Supported</h2>
            <p className="mb-4">
              Your browser or device doesn't support WebGL, which is required for this 3D solar system visualization.
            </p>
            <p className="text-sm text-gray-300">
              Please try using a modern browser like Chrome, Firefox, Safari, or Edge.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (canvasError) {
    return (
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#000011' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black bg-opacity-90 text-white p-8 rounded-lg max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">3D Graphics Error</h2>
            <p className="mb-4">{canvasError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            >
              Refresh Page
            </button>
          </div>
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
        <color attach="background" args={["#000011"]} />
        
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
        <h3 className="text-lg font-bold mb-2">Solar System Explorer</h3>
        <p className="text-sm mb-2">Click on planets to learn more about them</p>
        <p className="text-xs text-gray-300">
          Use mouse to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
}

export default App;
