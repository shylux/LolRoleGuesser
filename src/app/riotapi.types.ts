export interface IMatch {
  gameId: number;
  gameDuration: number;
  participants: Array<IParticipant>;
}

export interface IParticipant {
  participantId: number;
  teamId: number;
  championId: number;
  spell1Id: number;
  spell2Id: number;
  timeline: ITimeline;
  stats: IStats;
}

export interface ITimeline {
  role: string;
  lane: string;
}

export interface IStats {
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
}

export interface IChampion {
  id: string;
  key: string;
  name: string;
}

export enum Positions {
  TOP,
  JUNGLE,
  MID,
  BOT,
  SUPPORT
}
export const POSITION_NAMES = ['Top', 'Jungle', 'Mid', 'Bot', 'Support'];

export const TIERS = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
export const DIVISIONS = ['IV', 'III', 'II', 'I'];
