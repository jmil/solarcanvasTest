import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import "@fontsource/inter";
import { SolarSystem } from "./components/SolarSystem";
import { SolarSystem2D } from "./components/SolarSystem2D";
import { PlanetInfoPanel } from "./components/PlanetInfoPanel";
import { CameraControls } from "./components/CameraControls";
import { ResearchGalaxy3D } from "./components/ResearchGalaxy3D";
import { DoiInput } from "./components/DoiInput";
import { ResearchInfoPanel } from "./components/ResearchInfoPanel";
import { useResearchNetwork } from "./hooks/useResearchNetwork";
import type { PlanetData } from "./data/planetData";
import type { ResearcherData, PaperData } from "../../shared/research-types";

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
  // Solar System state
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [canvasError, setCanvasError] = useState<string | null>(null);
  
  // Research Galaxy state
  const { networkData, isLoading, error, fetchResearchNetwork, reset } = useResearchNetwork();
  const [selectedResearcher, setSelectedResearcher] = useState<ResearcherData | null>(null);
  const [selectedPublication, setSelectedPublication] = useState<PaperData | null>(null);
  const [appMode, setAppMode] = useState<'solar-system' | 'research-galaxy'>('solar-system');

  useEffect(() => {
    setWebglSupported(isWebGLSupported());
  }, []);

  // Error handler for Canvas
  const handleCanvasError = (error: any) => {
    console.error('Canvas error:', error);
    setCanvasError('Unable to initialize 3D graphics. Please try refreshing the page or using a different browser.');
  };

  // Mode switching
  const switchToResearchGalaxy = (doi: string) => {
    setAppMode('research-galaxy');
    fetchResearchNetwork(doi);
  };

  const switchToSolarSystem = () => {
    setAppMode('solar-system');
    reset();
    setSelectedResearcher(null);
    setSelectedPublication(null);
  };

  // Research galaxy handlers
  const handleResearcherClick = (researcher: ResearcherData) => {
    setSelectedResearcher(researcher);
    setSelectedPublication(null);
  };

  const handlePublicationClick = (publication: PaperData) => {
    setSelectedPublication(publication);
    setSelectedResearcher(null);
  };

  // DOI input screen for research galaxy mode
  if (appMode === 'research-galaxy' && !networkData && !isLoading) {
    return (
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }} 
           className="bg-gradient-to-b from-black via-purple-900 to-black flex items-center justify-center">
        <DoiInput onSubmit={switchToResearchGalaxy} isLoading={isLoading} />
        
        {error && (
          <div className="absolute bottom-4 left-4 right-4 bg-red-900 bg-opacity-80 text-white p-4 rounded-lg text-center">
            <p className="font-medium mb-2">Error fetching research data:</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => setAppMode('solar-system')} 
              className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm"
            >
              Return to Solar System
            </button>
          </div>
        )}
        
        {/* Mode switcher */}
        <div className="absolute bottom-4 left-4">
          <button
            onClick={switchToSolarSystem}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            ← Solar System Mode
          </button>
        </div>
      </div>
    );
  }

  // Loading screen for research network
  if (appMode === 'research-galaxy' && isLoading) {
    return (
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }} 
           className="bg-gradient-to-b from-black via-purple-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2">Mapping Research Galaxy...</h2>
          <p className="text-gray-300">Fetching citation data from PubMed</p>
        </div>
      </div>
    );
  }

  // Use 2D fallback if WebGL isn't supported or if there's a canvas error
  if (!webglSupported || canvasError) {
    if (appMode === 'solar-system') {
      return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
          <SolarSystem2D onPlanetClick={setSelectedPlanet} />
          
          {/* UI Overlay */}
          <PlanetInfoPanel 
            planet={selectedPlanet} 
            onClose={() => setSelectedPlanet(null)} 
          />
          
          {/* Mode switcher and instructions */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-xs">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-bold">Solar System Explorer</h3>
              <div className="ml-2 flex items-center">
                <span className="text-blue-400 text-sm" title="2D Mode">🖼️</span>
              </div>
            </div>
            <p className="text-sm mb-2">Click on planets to learn more about them</p>
            <p className="text-xs text-yellow-300 mt-2">2D Mode - Accessibility Optimized</p>
            <button 
              onClick={() => setAppMode('research-galaxy')}
              className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded"
            >
              🌌 Research Galaxy
            </button>
          </div>
        </div>
      );
    }
  }

  // Main 3D rendering
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Canvas
        shadows
        camera={{
          position: appMode === 'research-galaxy' ? [0, 20, 50] : [0, 10, 20],
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
        <color attach="background" args={appMode === 'research-galaxy' ? ["#0a0015"] : ["#1a0a2e"]} />
        
        {/* Lighting */}
        <ambientLight intensity={appMode === 'research-galaxy' ? 0.05 : 0.1} />
        {appMode === 'solar-system' && (
          <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />
        )}
        
        <Suspense fallback={null}>
          {appMode === 'solar-system' ? (
            <SolarSystem onPlanetClick={setSelectedPlanet} />
          ) : networkData ? (
            <ResearchGalaxy3D 
              networkData={networkData}
              onResearcherClick={handleResearcherClick}
              onPublicationClick={handlePublicationClick}
            />
          ) : null}
          <CameraControls />
        </Suspense>
      </Canvas>
      
      {/* UI Overlays */}
      {appMode === 'solar-system' ? (
        <PlanetInfoPanel 
          planet={selectedPlanet} 
          onClose={() => setSelectedPlanet(null)} 
        />
      ) : (
        <ResearchInfoPanel 
          researcher={selectedResearcher}
          publication={selectedPublication}
          onClose={() => {
            setSelectedResearcher(null);
            setSelectedPublication(null);
          }}
        />
      )}
      
      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-xs">
        <div className="flex items-center mb-2">
          <h3 className="text-lg font-bold">
            {appMode === 'solar-system' ? 'Solar System Explorer' : 'Research Galaxy'}
          </h3>
          <div className="ml-2 flex items-center">
            <span className="text-green-400 text-sm" title="3D Mode">🎮</span>
          </div>
        </div>
        <p className="text-sm mb-2">
          {appMode === 'solar-system' 
            ? 'Click on planets to learn more about them'
            : 'Click on stars (researchers) or planets (publications) to explore'
          }
        </p>
        <p className="text-xs text-gray-300">
          Use mouse to rotate • Scroll to zoom
        </p>
        
        {/* Mode switcher */}
        <button 
          onClick={appMode === 'solar-system' ? () => setAppMode('research-galaxy') : switchToSolarSystem}
          className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded"
        >
          {appMode === 'solar-system' ? '🌌 Research Galaxy' : '🪐 Solar System'}
        </button>
      </div>
    </div>
  );
}

export default App;
