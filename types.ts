
export interface Inspiration {
  id: string;
  content: string;
  date: string;
  tags: string[]; // e.g., 'Calm', 'Wind', 'Night'
  mood: 'peaceful' | 'melancholic' | 'joyful' | 'anxious' | 'neutral';
  imagery: string[]; // e.g., 'Bamboo', 'Moon', 'Cloud'
  imageUrl?: string;
  connections: string[]; // IDs of related inspirations
  challengeId?: string; // Optional link to a challenge
}

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'inspiration' | 'generated'; // Distinguish real vs AI nodes
  group: number;
  val: number;
  data?: Inspiration; // For real nodes
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  value?: number;
}

export enum AppTab {
  Wall = 'wall',
  Insights = 'insights',
  Capture = 'capture', // This is a modal action, but tracked for state
  Connections = 'connections',
  Profile = 'profile'
}

export interface DailyWisdom {
  term: string; // Solar term e.g., "White Dew"
  quote: string;
  author: string;
}

export interface Challenge {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  prompt: string;
  theme: string;
  completed: boolean;
}

export interface SocialPost {
  id: string;
  author: string;
  avatar: string; // url
  content: string;
  date: string;
  likes: number;
  isLiked: boolean; // simple local state
  tags: string[];
}

export type ViewMode = 'masonry' | 'timeline' | 'folder';

export type CaptureMode = 'text' | 'voice' | 'camera' | 'album';
