// Parsed script element
export interface ScriptElement {
  type: 'scene_heading' | 'action' | 'character' | 'dialogue' | 'parenthetical' | 'transition' | 'note' | 'section' | 'synopsis' | 'page_break' | 'blank';
  text: string;
  sceneNumber?: number;
}

export interface ParsedScript {
  title: string;
  author: string;
  elements: ScriptElement[];
  format: 'fountain' | 'fdx' | 'text' | 'unknown';
}

export type CastTier = 'lead' | 'supporting' | 'featured' | 'day_player';

export interface CastMember {
  name: string;
  lineCount: number;
  sceneCount: number;
  tier: CastTier;
  percentOfDialogue: number;
}

export interface ExtractedFeatures {
  totalScenes: number;
  uniqueLocations: number;
  interiorCount: number;
  exteriorCount: number;
  intExtCount: number;
  detectedCountries: string[];
  speakingRoles: number;
  characterNames: string[];
  stuntPages: number;
  vfxPages: number;
  vfxKeywords: string[];
  periodSetting: 'contemporary' | 'period' | 'futuristic';
  periodConfidence: number;
  dialogueRatio: number;
  actionRatio: number;
  estimatedPages: number;
  genre: string;
  subGenres: string[];
  genreConfidence: number;
  nightSceneRatio: number;
  averageDialogueLength: number;
  topCharacters: { name: string; lineCount: number }[];
  castBreakdown: CastMember[];
}

export interface CostEstimate {
  category: string;
  estimate: number;
  description: string;
}

export interface CompTitle {
  title: string;
  year: number;
  genre: string;
  budget: number;
  similarity: number;
  features: Partial<ExtractedFeatures>;
}

export interface FullReport {
  scriptTitle: string;
  features: ExtractedFeatures;
  estimates: CostEstimate[];
  totalBudget: number;
  comps: CompTitle[];
  warnings: string[];
  timestamp: string;
}

export interface DemoScript {
  name: string;
  description: string;
  genre: string;
  content: string;
}
