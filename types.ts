export enum CardGroup {
  WINNER = 'WINNER',
  MANIFEST = 'MANIFEST',
}

export interface Card {
  id: string;
  name: string;
  title: string;
  imageSeed: number; // For placeholder generation (deprecated in favor of imageUrl but kept for legacy)
  imageUrl: string; // New field for specific images
  group: CardGroup;
  flavor: string;
  message: string;
  advice: string; // "Lời khuyên" or specific message details
  color: string;
}

export interface UserData {
  fullName: string;
  phoneNumber: string;
  dob: string;
}

export type AppStep = 'FORM' | 'SHUFFLING' | 'RESULT';
