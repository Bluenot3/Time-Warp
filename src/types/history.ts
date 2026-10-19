export type RegionStyle =
  | 'northeast_urban'
  | 'european_stone'
  | 'west_coast'
  | 'midwest_main'
  | 'modern_metropolis';

export type WeatherMood =
  | 'clear_golden'
  | 'depression_overcast'
  | 'wwii_night_blitz'
  | 'vintage_sepia'
  | 'rain_noir'
  | 'modern_daylight';

export type ReenactmentMode =
  | 'ancient_classical'
  | 'depression_breadline'
  | 'depression_hooverville'
  | 'wwii_blitz'
  | 'wwii_liberation'
  | 'early_streetcar'
  | 'roaring_twenties'
  | 'cold_war'
  | 'modern_city';

export type CameraMode = 'orbit' | 'walk' | 'cinematic';

export type ZoomTier = 'street' | 'district' | 'world';

export interface HistoricalHotspot {
  id: string;
  title: string;
  category: string;
  yearBadge: string;
  description: string;
  citation: string;
  position: [number, number, number];
  cameraOffset: [number, number, number];
}

export interface GranularEntityRecord {
  id: string;
  entityType: 'citizen' | 'vehicle' | 'building' | 'infrastructure';
  name: string;
  roleOrClass: string;
  yearBadge: string;
  microBiography: string;
  granularSpecs: Array<{ label: string; value: string }>;
  archivalSource: string;
  worldPosition: [number, number, number];
  isMoving?: boolean;
}

export interface GroundingSource {
  title: string;
  uri: string;
  sourceType: 'web' | 'maps';
}

export interface WorldCityNode {
  id: string;
  city: string;
  country: string;
  defaultAddress: string;
  lat: number;
  lng: number;
  worldX: number;
  worldZ: number;
  streetAzimuth: number;
  regionStyle: RegionStyle;
  yearHeadline: string;
  yearStatus: string;
  reenactmentMode: ReenactmentMode;
  weatherMood: WeatherMood;
}

export interface HistoricalSceneBlueprint {
  id: string;
  address: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  year: number;
  streetAzimuth: number;
  regionStyle: RegionStyle;
  weatherMood: WeatherMood;
  reenactmentMode: ReenactmentMode;
  headline: string;
  eraLabel: string;
  historicalSummary: string;
  architecturalNotes: string;
  reenactmentHighlights: string[];
  streetSignText: string;
  bannerText: string;
  secondaryBannerText: string;
  hotspots: HistoricalHotspot[];
  groundingSources: GroundingSource[];
  spatialSummary?: string;
  customPromptUsed?: string;
  synthesizedByAi?: boolean;
}
