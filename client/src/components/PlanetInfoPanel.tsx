import { type PlanetData } from "../data/planetData";

interface PlanetInfoPanelProps {
  planet: PlanetData | null;
  onClose: () => void;
}

export function PlanetInfoPanel({ planet, onClose }: PlanetInfoPanelProps) {
  if (!planet) return null;

  return (
    <div className="absolute top-4 right-4 bg-black bg-opacity-90 text-white p-6 rounded-lg max-w-md max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold" style={{ color: planet.color }}>
          {planet.name}
        </h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 text-xl font-bold w-8 h-8 flex items-center justify-center"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-300">Diameter:</span>
            <p className="font-semibold">{planet.facts.diameter}</p>
          </div>
          <div>
            <span className="text-gray-300">Mass:</span>
            <p className="font-semibold">{planet.facts.mass}</p>
          </div>
          <div>
            <span className="text-gray-300">Distance from Sun:</span>
            <p className="font-semibold">{planet.facts.distanceFromSun}</p>
          </div>
          <div>
            <span className="text-gray-300">Day Length:</span>
            <p className="font-semibold">{planet.facts.dayLength}</p>
          </div>
          <div>
            <span className="text-gray-300">Year Length:</span>
            <p className="font-semibold">{planet.facts.yearLength}</p>
          </div>
          <div>
            <span className="text-gray-300">Temperature:</span>
            <p className="font-semibold">{planet.facts.temperature}</p>
          </div>
          <div>
            <span className="text-gray-300">Moons:</span>
            <p className="font-semibold">{planet.facts.moons}</p>
          </div>
          <div>
            <span className="text-gray-300">Atmosphere:</span>
            <p className="font-semibold">{planet.facts.atmosphere}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-600">
          <span className="text-gray-300">Did you know?</span>
          <p className="mt-1 text-sm leading-relaxed">{planet.facts.interestingFact}</p>
        </div>
      </div>
    </div>
  );
}
