import { Relic, BonusCard, Obstacle, ComicChapter } from '../types/game';

export const WORLD_WIDTH = 2000;
export const WORLD_HEIGHT = 2000;

export const INITIAL_RELICS: Relic[] = [
  // Chapter 1: The Moon
  {
    id: 1,
    chapter: 1,
    name: 'Apollo Science Station (ALSEP)',
    subtitle: 'Apollo Lunar Surface Experiments Package',
    x: 650,
    y: 500,
    radius: 36,
    recovered: false,
    icon: '⚡',
    year: '1969–1972',
    coordinates: 'Oceanus Procellarum / Fra Mauro',
    mission: 'Apollo Program',
    facts: [
      'ALSEP was powered by SNAP-27 Radioisotope Thermoelectric Generators (RTGs), delivering 70 watts of electricity from decaying Plutonium-238.',
      'Instruments recorded lunar seismology, revealing that the Moon experiences deep moonquakes triggered by tidal stresses from Earth.',
      'The stations transmitted lunar seismic, solar wind, and atmospheric telemetry continuously to Earth until September 30, 1977.'
    ],
    sourceUrl: 'https://curator.jsc.nasa.gov/lunar/alsep.cfm',
    quiz: {
      question: 'What provided continuous electrical power to the Apollo ALSEP station during the 14-day freezing lunar nights?',
      options: [
        'Solar collector panels',
        'Radioisotope Thermoelectric Generator (RTG)',
        'Hydrogen fuel cell canisters',
        'Silver-zinc secondary batteries'
      ],
      correctIndex: 1,
      explanation: 'SNAP-27 Radioisotope Thermoelectric Generators used the decay heat of Plutonium-238 to generate continuous electricity through thermoelectric couples.'
    }
  },
  {
    id: 2,
    chapter: 1,
    name: 'Apollo Lunar Roving Vehicle (LRV)',
    subtitle: 'The Legendary Lunar Moon Buggy',
    x: 1350,
    y: 750,
    radius: 40,
    recovered: false,
    icon: '🚜',
    year: '1971–1972',
    coordinates: 'Hadley-Apennine (26.13°N 3.63°E)',
    mission: 'Apollo 15, 16, and 17',
    facts: [
      'Built by Boeing and Delco Electronics, the LRV weighed 210 kg on Earth but only 35 kg under lunar gravity.',
      'Its four wheels were made of woven zinc-coated steel wire mesh with titanium chevrons for traction on abrasive lunar dust.',
      'During Apollo 17, Gene Cernan and Harrison Schmitt drove 35.7 km across Taurus-Littrow, achieving a top speed of 18 km/h.'
    ],
    sourceUrl: 'https://www.nasa.gov/history/alsj/lrv.html',
    quiz: {
      question: 'What were the tires of the Apollo Lunar Roving Vehicle constructed from?',
      options: [
        'Vulcanized pressurized rubber',
        'Solid carbon composite bands',
        'Woven zinc-coated steel wire mesh with titanium treads',
        'Tensioned spring aluminum coils'
      ],
      correctIndex: 2,
      explanation: 'Because conventional rubber would become brittle in the extreme temperatures of the Moon, engineers used woven zinc-coated steel wire mesh with chevron titanium treads.'
    }
  },
  {
    id: 3,
    chapter: 1,
    name: 'Surveyor 3 Robotic Lander',
    subtitle: 'Uncrewed Lunar Pioneer',
    x: 700,
    y: 1350,
    radius: 38,
    recovered: false,
    icon: '📡',
    year: '1967',
    coordinates: 'Oceanus Procellarum (3.01°S 23.42°W)',
    mission: 'Surveyor Program',
    facts: [
      'Surveyor 3 was the first spacecraft to dig into extraterrestrial soil using a robotic trenching scoop.',
      'In November 1969, Apollo 12 astronauts Pete Conrad and Alan Bean landed within walking distance (163 meters) of Surveyor 3.',
      'The astronauts clipped its TV camera and mechanical arm to return to Earth for forensic analysis of long-term space exposure.'
    ],
    sourceUrl: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A',
    quiz: {
      question: 'Which crewed Apollo mission landed near Surveyor 3 and retrieved parts of it to bring back to Earth?',
      options: [
        'Apollo 11',
        'Apollo 12',
        'Apollo 13',
        'Apollo 14'
      ],
      correctIndex: 1,
      explanation: 'Apollo 12 achieved a pinpoint landing right on the rim of Surveyor Crater, allowing astronauts Pete Conrad and Alan Bean to inspect Surveyor 3 in person.'
    }
  },

  // Chapter 2: Mars
  {
    id: 4,
    chapter: 2,
    name: 'Viking 1 Lander',
    subtitle: 'First Successful Long-Duration Mars Surface Mission',
    x: 600,
    y: 650,
    radius: 40,
    recovered: false,
    icon: '🛰️',
    year: '1976',
    coordinates: 'Chryse Planitia (22.697°N 48.222°W)',
    mission: 'Viking Program',
    facts: [
      'Viking 1 touched down on July 20, 1976, transmitting the first high-resolution color photographs from the Martian surface.',
      'Its robotic arm scooped Martian soil into automated biology miniature laboratories searching for metabolic life signatures.',
      'It operated for 2,245 Martian sols (over 6 Earth years) until an accidental command terminated communications in November 1982.'
    ],
    sourceUrl: 'https://mars.nasa.gov/mars-exploration/missions/viking-1-2/',
    quiz: {
      question: 'What vast lowland plain on Mars did Viking 1 land upon in 1976?',
      options: [
        'Valles Marineris',
        'Chryse Planitia (Plains of Gold)',
        'Gale Crater',
        'Isidis Planitia'
      ],
      correctIndex: 1,
      explanation: 'Viking 1 touched down in Chryse Planitia, a smooth circular sedimentary basin chosen for landing safety.'
    }
  },
  {
    id: 5,
    chapter: 2,
    name: 'Phoenix Mars Lander',
    subtitle: 'Arctic Scout of the Martian North',
    x: 1400,
    y: 600,
    radius: 38,
    recovered: false,
    icon: '⛏️',
    year: '2008',
    coordinates: 'Green Valley, Vastitas Borealis (68.22°N 125.75°W)',
    mission: 'Mars Scout Program',
    facts: [
      'Phoenix landed in Mars arctic northern plains, utilizing a trenching robotic arm with a motorized scraping blade.',
      'Its cameras documented diced white chunks exposed in the trenches that sublimated over four days, proving the presence of water ice.',
      'Phoenix also detected perchlorate salts in Martian soil, reshaping our understanding of potential habitability and soil chemistry.'
    ],
    sourceUrl: 'https://mars.nasa.gov/missions/phoenix/',
    quiz: {
      question: 'What discovery confirmed that white material uncovered by Phoenix was water ice rather than dry ice (carbon dioxide)?',
      options: [
        'It glowed blue under UV laser spectroscopy',
        'It melted into liquid water streams instantly',
        'Chunks sublimated slowly over four days in sunlight',
        'It expanded and fractured surrounding rocks'
      ],
      correctIndex: 2,
      explanation: 'Over four Martian days, time-lapse photography showed white chunks slowly sublimating into vapor at summer arctic temperatures, matching water ice thermodynamics.'
    }
  },
  {
    id: 6,
    chapter: 2,
    name: 'Ingenuity Mars Helicopter',
    subtitle: 'First Powered Aircraft on Another World',
    x: 1050,
    y: 1350,
    radius: 36,
    recovered: false,
    icon: '🚁',
    year: '2021–2024',
    coordinates: 'Jezero Crater (18.44°N 77.45°E)',
    mission: 'Mars 2020 (Perseverance)',
    facts: [
      'Ingenuity carried a small swatch of unbleached muslin wing fabric from the original 1903 Wright Flyer beneath its solar panel.',
      'To achieve aerodynamic lift in Mars atmosphere (less than 1% of Earth air density), twin counter-rotating carbon-fiber blades spun at 2,400+ RPM.',
      'Originally designed for 5 technology demonstration flights, Ingenuity flew 72 times and logged over 17 kilometers across Jezero Crater.'
    ],
    sourceUrl: 'https://mars.nasa.gov/technology/helicopter/',
    quiz: {
      question: 'What historical terrestrial aviation artifact was carried aboard Ingenuity under its solar panel?',
      options: [
        'A rivet from the Apollo 11 Saturn V rocket',
        'A fabric swatch from the 1903 Wright Brothers Flyer',
        'A piece of Amelia Earhart Lockheed Electra wing',
        'A micro-filament from Chuck Yeager Bell X-1'
      ],
      correctIndex: 1,
      explanation: 'NASA attached a postage-stamp-sized piece of fabric from the Wright Brothers 1903 Flyer to honor humanity\'s first powered aviation milestone.'
    }
  }
];

export const CHAPTER_BONUS_CARDS: BonusCard[] = [
  // Chapter 1: The Moon
  {
    id: 1,
    chapter: 1,
    name: 'Apollo 11 Commemorative Plaque',
    location: 'Sea of Tranquility Footprint Site',
    x: 350,
    y: 400,
    collected: false,
    fact: 'Mounted on the descent stage ladder: "Here Men From Planet Earth First Set Foot Upon the Moon, July 1969 A.D. We Came In Peace For All Mankind."',
    date: 'July 20, 1969'
  },
  {
    id: 2,
    chapter: 1,
    name: 'The Genesis Rock Sample 15415',
    location: 'Spur Crater Anorthosite Outcrop',
    x: 1600,
    y: 1400,
    collected: false,
    fact: 'Retrieved by Apollo 15 astronauts, this 4-billion-year-old anorthosite rock verified the Lunar Magma Ocean hypothesis formed shortly after the solar system began.',
    date: 'August 1, 1971'
  },
  // Chapter 2: Mars
  {
    id: 3,
    chapter: 2,
    name: 'Jezero Crater River Delta Ancient Bed',
    location: 'Neretva Vallis Inflow Site',
    x: 400,
    y: 1500,
    collected: false,
    fact: 'Over 3.5 billion years ago, an ancient lake filled Jezero Crater. Perseverance rover cored fine-grained clay mudstones preserving possible biosignatures.',
    date: 'Mars 2020 Mission'
  },
  {
    id: 4,
    chapter: 2,
    name: 'Olympus Mons Basalt Lava Channel',
    location: 'Tharsis Volcanic Plateau Edge',
    x: 1650,
    y: 350,
    collected: false,
    fact: 'Standing 21.9 km high, Olympus Mons is the tallest planetary shield volcano in the Solar System, roughly 2.5 times Mount Everest\'s height above sea level.',
    date: 'Martian Geological Epoch'
  }
];

export const CHAPTER_OBSTACLES: Record<1 | 2, Obstacle[]> = {
  1: [
    // Moon craters and boulders
    { x: 450, y: 700, radius: 55, type: 'crater' },
    { x: 950, y: 350, radius: 70, type: 'crater' },
    { x: 1200, y: 1100, radius: 85, type: 'crater' },
    { x: 300, y: 1100, radius: 45, type: 'crater' },
    { x: 1650, y: 800, radius: 60, type: 'crater' },
    { x: 800, y: 950, radius: 50, type: 'crater' },
    { x: 550, y: 300, radius: 30, type: 'boulder' },
    { x: 1050, y: 650, radius: 35, type: 'boulder' },
    { x: 1450, y: 1350, radius: 40, type: 'boulder' },
    { x: 750, y: 1650, radius: 32, type: 'boulder' },
    { x: 1550, y: 450, radius: 38, type: 'boulder' }
  ],
  2: [
    // Mars iron boulders and craters
    { x: 500, y: 450, radius: 65, type: 'crater' },
    { x: 1150, y: 350, radius: 75, type: 'crater' },
    { x: 800, y: 850, radius: 60, type: 'dune' },
    { x: 1400, y: 1050, radius: 70, type: 'crater' },
    { x: 400, y: 1100, radius: 55, type: 'dune' },
    { x: 1650, y: 900, radius: 50, type: 'boulder' },
    { x: 700, y: 1500, radius: 65, type: 'crater' },
    { x: 1250, y: 1550, radius: 45, type: 'boulder' },
    { x: 900, y: 400, radius: 35, type: 'boulder' },
    { x: 350, y: 800, radius: 40, type: 'boulder' },
    { x: 1500, y: 350, radius: 38, type: 'boulder' }
  ]
};

export const COMIC_CHAPTERS: Record<1 | 2, ComicChapter> = {
  1: {
    chapter: 1,
    title: 'Chapter 1: The Moon',
    tagline: 'Silent Monuments in the Regolith',
    panels: [
      {
        title: 'Panel 1: The Forgotten Beacons',
        caption: 'For centuries, instruments crafted by early human space pioneers remained asleep on the silver surface.',
        subtext: 'Deep space telemetry recorded faint resonant harmonics from Apollo landing sites.',
        illustrationType: 'earth_void'
      },
      {
        title: 'Panel 2: Autonomous Scout Drone AL-09',
        caption: 'Scout drone AL-09 awakens in low lunar orbit, synchronizing star coordinates with historical NASA archives.',
        subtext: 'Scanning Oceanus Procellarum, Fra Mauro, and Hadley Rille.',
        illustrationType: 'orbit_ship'
      },
      {
        title: 'Panel 3: Touchdown in Grey Dust',
        caption: 'Pressurized boots meet pristine grey regolith. Gravity is one-sixth of Earth; footprints will outlast empires.',
        subtext: 'Surface temperature: -130°C. Solar radiation within safe limits.',
        illustrationType: 'boots_touch'
      },
      {
        title: 'Panel 4: Echoes of Apollo',
        caption: 'In the distance, gold mylar and metallic struts shimmer along the crater horizon.',
        subtext: 'Surveyor 3, Apollo ALSEP, and the Lunar Rover await recovery.',
        illustrationType: 'crater_glint'
      },
      {
        title: 'Panel 5: The Directive',
        caption: 'Drone AL-09 initiates guidance lock: locate each historic relic, repair systems, and log historical telemetry.',
        subtext: 'Guidance laser calibrated. Minimap synchronized.',
        illustrationType: 'drone_scan'
      },
      {
        title: 'Panel 6: Recovery Commences',
        caption: 'The vast silent wilderness awaits. Step forward, Explorer. Awaken the pioneers.',
        subtext: 'Controls initialized. Press or drag to move.',
        illustrationType: 'suit_ready'
      }
    ]
  },
  2: {
    chapter: 2,
    title: 'Chapter 2: Mars',
    tagline: 'Red Sands of Chryse and Beyond',
    panels: [
      {
        title: 'Panel 1: The Crimson Horizon',
        caption: 'The recovery ship completes orbital insertion over the rust-red deserts of Mars.',
        subtext: 'Atmospheric pressure: 6.1 millibars. Carbon dioxide winds sweeping across the plains.',
        illustrationType: 'mars_transfer'
      },
      {
        title: 'Panel 2: Descent Through Dust',
        caption: 'Entering the thin Martian skies, iron oxide dust sweeps over the recovery suit visor in dancing gusts.',
        subtext: 'Dusk illumination fading into deep vermillion.',
        illustrationType: 'dust_entry'
      },
      {
        title: 'Panel 3: The Golden Plains of Viking',
        caption: 'Forty-eight years ago, humankind received their first panoramic color vistas of another planet from here.',
        subtext: 'Viking 1 Lander, Phoenix Arctic Lander, and Ingenuity Helicopter wait half-buried in red sediment.',
        illustrationType: 'ancient_lander'
      },
      {
        title: 'Panel 4: Drone Calibrations',
        caption: 'AL-09 adjusts twin thrusters against the Martian atmosphere, tracking faint radio beacons in the dust storms.',
        subtext: 'Radio direction finder pinging at 401 MHz.',
        illustrationType: 'drone_wind'
      },
      {
        title: 'Panel 5: Wings of Ingenuity',
        caption: 'A whisper of carbon fiber rotors in Jezero Crater... the brave little scout that conquered Martian flight.',
        subtext: 'Powered flight distance records confirmed.',
        illustrationType: 'helicopter_wings'
      },
      {
        title: 'Panel 6: The Final Leg',
        caption: 'Traverse the red terrain, uncover the subterranean ice, and complete humanity\'s historical recovery ledger.',
        subtext: 'Chapter 2: Mars initiated.',
        illustrationType: 'martian_soil'
      }
    ]
  }
};
