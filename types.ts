export interface Week {
  week: number | string;
  learning: string;
  practice: string;
}

export interface Month {
  title: string;
  weeks: Week[];
}

// Fix: Made uri and title optional to match the GroundingChunk type from the @google/genai library.
export interface GroundingSource {
  uri?: string;
  title?: string;
}

export interface GroundingChunk {
  web?: GroundingSource;
  maps?: GroundingSource;
}


export interface Resource {
  text: string;
  sources: GroundingChunk[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export enum AiTool {
  Tutor = 'AI Tutor',
  ImageGen = 'Image Generator',
  StudySpots = 'Study Spot Finder'
}
