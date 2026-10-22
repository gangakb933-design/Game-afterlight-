export type ChapterId = 1 | 2;

export interface Relic {
  id: number;
  chapter: ChapterId;
  name: string;
  subtitle: string;
  x: number;
  y: number;
  radius: number;
  recovered: boolean;
  icon: string;
  year: string;
  coordinates: string;
  mission: string;
  photoUrl?: string;
  facts: string[];
  sourceUrl: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface BonusCard {
  id: number;
  chapter: ChapterId;
  name: string;
  location: string;
  x: number;
  y: number;
  collected: boolean;
  fact: string;
  date: string;
}

export interface Obstacle {
  x: number;
  y: number;
  radius: number;
  type: 'crater' | 'boulder' | 'dune';
}

export interface Footprint {
  x: number;
  y: number;
  angle: number;
  alpha: number;
  isRight: boolean;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  alpha: number;
  color?: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface ComicPanel {
  title: string;
  caption: string;
  subtext: string;
  illustrationType: 'earth_void' | 'orbit_ship' | 'boots_touch' | 'crater_glint' | 'drone_scan' | 'suit_ready' |
                    'mars_transfer' | 'dust_entry' | 'ancient_lander' | 'drone_wind' | 'helicopter_wings' | 'martian_soil';
}

export interface ComicChapter {
  chapter: ChapterId;
  title: string;
  tagline: string;
  panels: ComicPanel[];
}
