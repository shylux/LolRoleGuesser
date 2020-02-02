export interface IMatch {
  gameId: number;
  gameDuration: number;
  participants: Array<IParticipant>;
}

export interface IMatchReference {
  gameId: number;
  queue: number;
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
export const TIERS_UPPER = TIERS.map(tier => tier.toUpperCase());
export const DIVISIONS = ['IV', 'III', 'II', 'I'];

export function getPosition(timeline: ITimeline): Positions {
  switch (timeline.lane) {
    case 'TOP':
      return Positions.TOP;
    case 'JUNGLE':
      return Positions.JUNGLE;
    case 'MIDDLE':
      return Positions.MID;
    case 'BOTTOM':
    default:
      if (timeline.role === 'DUO_SUPPORT') {
        return Positions.SUPPORT;
      } else {
        return Positions.BOT;
      }
  }
}
