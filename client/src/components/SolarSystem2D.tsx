import { useState, useEffect } from "react";
import { planetsData, type PlanetData } from "../data/planetData";

interface SolarSystem2DProps {
  onPlanetClick: (planet: PlanetData) => void;
}

export function SolarSystem2D({ onPlanetClick }: SolarSystem2DProps) {
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const animate = () => {
      setAnimationFrame(prev => prev + 1);
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <div className="w-full h-full relative bg-gradient-to-b from-black via-purple-900 to-black overflow-hidden">
      {/* Star field - static to avoid seizure risk */}
      <div className="absolute inset-0">
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 1.5 + 0.5}px`,
              height: `${Math.random() * 1.5 + 0.5}px`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Solar system container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ width: '800px', height: '800px' }}>
          
          {/* Orbital paths */}
          {planetsData.map((planet, index) => (
            <div
              key={`orbit-${planet.name}`}
              className="absolute border border-white border-opacity-20 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                width: `${planet.distance * 20}px`,
                height: `${planet.distance * 20}px`,
                marginLeft: `-${planet.distance * 10}px`,
                marginTop: `-${planet.distance * 10}px`,
              }}
            />
          ))}

          {/* Sun */}
          <div
            className="absolute rounded-full bg-yellow-400 shadow-lg animate-pulse"
            style={{
              left: '50%',
              top: '50%',
              width: '60px',
              height: '60px',
              marginLeft: '-30px',
              marginTop: '-30px',
              boxShadow: '0 0 30px #FDB813, 0 0 60px #FDB813',
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-600" />
          </div>

          {/* Planets */}
          {planetsData.map((planet, index) => {
            const angle = (animationFrame * planet.orbitSpeed * 0.002) + (index * 0.5);
            const x = Math.cos(angle) * planet.distance * 10;
            const y = Math.sin(angle) * planet.distance * 10;
            
            return (
              <div
                key={planet.name}
                className="absolute cursor-pointer transition-all duration-200 hover:scale-125 group"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: `${x - planet.size * 15}px`,
                  marginTop: `${y - planet.size * 15}px`,
                }}
                onClick={() => onPlanetClick(planet)}
              >
                {/* Planet */}
                <div
                  className="rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
                  style={{
                    width: `${planet.size * 30 + 10}px`,
                    height: `${planet.size * 30 + 10}px`,
                    backgroundColor: planet.color,
                    boxShadow: `0 0 10px ${planet.color}50`,
                  }}
                />
                
                {/* Planet name label */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {planet.name}
                  </div>
                </div>

                {/* Saturn's rings */}
                {planet.name === "Saturn" && (
                  <div
                    className="absolute inset-0 rounded-full border-4 border-yellow-600 opacity-60"
                    style={{
                      width: `${planet.size * 30 + 25}px`,
                      height: `${planet.size * 30 + 25}px`,
                      marginLeft: `-7.5px`,
                      marginTop: `-7.5px`,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
        <p className="text-sm opacity-75">Click on any planet to learn fascinating facts about it!</p>
      </div>
    </div>
  );
}