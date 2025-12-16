
export enum AppView {
  HOME = 'HOME',
  SCHEDULE = 'SCHEDULE',
  STAMPS = 'STAMPS',
  LYRIC_GAME = 'LYRIC_GAME', // New: 猜歌詞
  BLOCK_GAME = 'BLOCK_GAME', // New: 拼團名
  SCANNER = 'SCANNER',
  BINDER = 'BINDER'
}

export interface ScanResult {
  idolName: string;
  groupName: string;
  albumOrEra: string;
  estimatedPrice: string;
  rarity: string;
}

export interface Photocard {
  id: string;
  idolName: string;
  groupName: string;
  albumOrEra: string;
  estimatedPrice: string;
  rarity: string;
  imageUrl: string;
  dateAcquired: number;
}

export interface StampLocation {
  id: string;
  name: string;
  date: string;
  location: string;
  isCollected: boolean;
  imageUrl: string;
  userImageUrl?: string; // Allow user to upload their own photo
}

// Schedule Types
export type EventType = 'CONCERT' | 'BROADCAST' | 'FANMEETING' | 'RELEASE' | 'BIRTHDAY';

export interface ScheduleEvent {
  id: string;
  groupName: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location?: string;
  type: EventType;
  description?: string;
  isAddedToMySchedule: boolean;
  userPhoto?: string; 
  userNotes?: string;
}

export interface SeatInfo {
  id: string;
  section: string;
  price: string;
  viewDescription: string;
  x: number;
  y: number;
}
