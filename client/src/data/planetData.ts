export interface PlanetData {
  name: string;
  size: number;
  distance: number;
  color: string;
  rotationSpeed: number;
  orbitSpeed: number;
  facts: {
    diameter: string;
    mass: string;
    distanceFromSun: string;
    dayLength: string;
    yearLength: string;
    temperature: string;
    moons: string;
    atmosphere: string;
    interestingFact: string;
  };
}

export const planetsData: PlanetData[] = [
  {
    name: "Mercury",
    size: 0.38,
    distance: 8,
    color: "#8C7853",
    rotationSpeed: 0.017,
    orbitSpeed: 0.04,
    facts: {
      diameter: "4,879 km",
      mass: "3.3 × 10²³ kg",
      distanceFromSun: "58 million km",
      dayLength: "59 Earth days",
      yearLength: "88 Earth days",
      temperature: "-173°C to 427°C",
      moons: "0",
      atmosphere: "Virtually none",
      interestingFact: "Mercury has the most eccentric orbit of all planets and experiences extreme temperature variations."
    }
  },
  {
    name: "Venus",
    size: 0.95,
    distance: 11,
    color: "#FFC649",
    rotationSpeed: -0.004,
    orbitSpeed: 0.03,
    facts: {
      diameter: "12,104 km",
      mass: "4.87 × 10²⁴ kg",
      distanceFromSun: "108 million km",
      dayLength: "243 Earth days (retrograde)",
      yearLength: "225 Earth days",
      temperature: "462°C (surface)",
      moons: "0",
      atmosphere: "96% CO₂, thick clouds of sulfuric acid",
      interestingFact: "Venus rotates backwards and is the hottest planet in our solar system due to its extreme greenhouse effect."
    }
  },
  {
    name: "Earth",
    size: 1.0,
    distance: 15,
    color: "#6B93D6",
    rotationSpeed: 0.017,
    orbitSpeed: 0.02,
    facts: {
      diameter: "12,756 km",
      mass: "5.97 × 10²⁴ kg",
      distanceFromSun: "150 million km",
      dayLength: "24 hours",
      yearLength: "365.25 days",
      temperature: "-88°C to 58°C",
      moons: "1 (Luna)",
      atmosphere: "78% N₂, 21% O₂",
      interestingFact: "Earth is the only known planet with life and has liquid water covering 71% of its surface."
    }
  },
  {
    name: "Mars",
    size: 0.53,
    distance: 20,
    color: "#CD5C5C",
    rotationSpeed: 0.018,
    orbitSpeed: 0.015,
    facts: {
      diameter: "6,792 km",
      mass: "6.42 × 10²³ kg",
      distanceFromSun: "228 million km",
      dayLength: "24.6 hours",
      yearLength: "687 Earth days",
      temperature: "-87°C to -5°C",
      moons: "2 (Phobos, Deimos)",
      atmosphere: "95% CO₂, very thin",
      interestingFact: "Mars has the largest volcano in the solar system (Olympus Mons) and evidence of ancient river valleys."
    }
  },
  {
    name: "Jupiter",
    size: 2.5,
    distance: 30,
    color: "#D8CA9D",
    rotationSpeed: 0.04,
    orbitSpeed: 0.008,
    facts: {
      diameter: "142,984 km",
      mass: "1.90 × 10²⁷ kg",
      distanceFromSun: "778 million km",
      dayLength: "9.9 hours",
      yearLength: "12 Earth years",
      temperature: "-110°C (cloud tops)",
      moons: "95+ (including Io, Europa, Ganymede, Callisto)",
      atmosphere: "89% H₂, 10% He",
      interestingFact: "Jupiter is so massive it could contain all other planets combined and acts as a cosmic vacuum cleaner, protecting inner planets."
    }
  },
  {
    name: "Saturn",
    size: 2.1,
    distance: 40,
    color: "#FAD5A5",
    rotationSpeed: 0.038,
    orbitSpeed: 0.006,
    facts: {
      diameter: "120,536 km",
      mass: "5.68 × 10²⁶ kg",
      distanceFromSun: "1.43 billion km",
      dayLength: "10.7 hours",
      yearLength: "29 Earth years",
      temperature: "-140°C (cloud tops)",
      moons: "146+ (including Titan, Enceladus)",
      atmosphere: "96% H₂, 3% He",
      interestingFact: "Saturn's rings are made of ice and rock particles, and the planet is less dense than water - it would float!"
    }
  },
  {
    name: "Uranus",
    size: 1.6,
    distance: 55,
    color: "#4FD0E7",
    rotationSpeed: 0.014,
    orbitSpeed: 0.004,
    facts: {
      diameter: "51,118 km",
      mass: "8.68 × 10²⁵ kg",
      distanceFromSun: "2.87 billion km",
      dayLength: "17.2 hours",
      yearLength: "84 Earth years",
      temperature: "-195°C",
      moons: "27 (including Titania, Oberon)",
      atmosphere: "83% H₂, 15% He, 2% methane",
      interestingFact: "Uranus rotates on its side at a 98-degree angle and has faint rings discovered in 1977."
    }
  },
  {
    name: "Neptune",
    size: 1.5,
    distance: 70,
    color: "#4B70DD",
    rotationSpeed: 0.016,
    orbitSpeed: 0.003,
    facts: {
      diameter: "49,528 km",
      mass: "1.02 × 10²⁶ kg",
      distanceFromSun: "4.5 billion km",
      dayLength: "16.1 hours",
      yearLength: "165 Earth years",
      temperature: "-200°C",
      moons: "16+ (including Triton)",
      atmosphere: "80% H₂, 19% He, 1% methane",
      interestingFact: "Neptune has the fastest winds in the solar system, reaching speeds of up to 2,100 km/h, and was discovered mathematically before being observed."
    }
  }
];
