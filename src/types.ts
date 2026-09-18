export interface GameItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  author: string;
  rating: number;
  plays: number;
  controls: string;
  thumbnailBg?: string;
  icon?: string;
  iframe: string;
  iframeUrl?: string;
  isCustom?: boolean;
}

export type GameCategory = 'All' | 'Arcade' | 'Puzzle' | 'Action' | 'Retro' | 'Favorites';

export interface TabDisguise {
  id: string;
  name: string;
  title: string;
  favicon: string;
}
