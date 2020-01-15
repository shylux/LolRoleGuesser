import {Injectable} from '@angular/core';
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class RiotAPIService {

  private gameVersion: string;
  private champions = {};

  private apiKey: string; // = 'RGAPI-4ced3570-9426-43f5-9a2e-be58faa7f88c';
  private domain = ''; // private domain = 'https://euw1.api.riotgames.com';

  private ajaxDefaultSettings = {
    dataType: 'json',
    data: {
      api_key: null
    }
  };

  constructor() {
  }

  async initialize() {
    if (!this.gameVersion) {
      this.apiKey = await this.loadApiKey();
      this.ajaxDefaultSettings.data.api_key = this.apiKey;
      this.gameVersion = await this.loadGameVersion();
      this.champions = await this.loadChampions();
    }
  }

  async getChampion(championId: number): Promise<IChampion> {
    await this.initialize();
    return this.champions[championId];
  }

  getChampionIconUrl(champion: IChampion) {
    return `http://ddragon.leagueoflegends.com/cdn/${this.gameVersion}/img/champion/${champion.id}.png`;
  }

  async getRandomGame(tier: string, division: string): Promise<IMatch> {
    await this.initialize();
    console.log(this.gameVersion);
    const encryptedSummonerId = await this.getRandomSummonerInSelectedLeague(tier, division);
    const accountId = await this.getAccoundIdFromSummonerId(encryptedSummonerId);
    const matchId = await this.getRandomMatchOfAccountId(accountId);
    const match = await this.getMatch(matchId);
    return match as IMatch;
  }

  async getRandomSummonerInSelectedLeague(tier: string, division: string, queue = 'RANKED_SOLO_5x5'): Promise<string> {
    const url = `${this.domain}/lol/league/v4/entries/${queue}/${tier}/${division}`;

    const summoners = await $.ajax({
      ...this.ajaxDefaultSettings,
      url
    });

    return summoners[Math.floor(Math.random() * summoners.length)].summonerId;
  }

  async getAccoundIdFromSummonerId(encryptedSummonerId: string): Promise<string> {
    const url = `${this.domain}/lol/summoner/v4/summoners/${encryptedSummonerId}`;
    const account = await $.ajax({
      ...this.ajaxDefaultSettings,
      url
    });
    return account.accountId;
  }

  async getRandomMatchOfAccountId(encryptedAccountId: string): Promise<string> {
    const queue = 420; // ranked 5v5
    const url = `${this.domain}/lol/match/v4/matchlists/by-account/${encryptedAccountId}`;
    const matchesResult = await $.ajax({
      ...this.ajaxDefaultSettings,
      url
    });
    let matches = matchesResult.matches.filter((match) => match.queue === queue); // filter matches to only contain ranked games
    matches = matches.slice(0, 5); // trim to get some newer games
    if (matches.length === 0) { throw new Error('No recent ranked matches found for this account'); }
    return matches[Math.floor(Math.random() * matches.length)].gameId;
  }

  async getMatch(matchId: string): Promise<IMatch> {
    const url = `${this.domain}/lol/match/v4/matches/${matchId}`;
    const match = await $.ajax({
      ...this.ajaxDefaultSettings,
      url
    });
    return match as IMatch;
  }

  /* Setup and general data stuff */
  async loadApiKey(): Promise<string> {
    const key = await $.get('/assets/key.txt');
    return key.trim();
  }

  async loadGameVersion(): Promise<string> {
    const versions = await $.getJSON('https://ddragon.leagueoflegends.com/api/versions.json');
    return versions[0];
  }

  async loadChampions(): Promise<object> {
    const champion = await $.getJSON(`http://ddragon.leagueoflegends.com/cdn/${this.gameVersion}/data/en_US/champion.json`);
    const champions = {};
    for (const champ of Object.values<any>(champion.data)) {
      champions[+champ.key] = champ;
    }
    return champions;
  }
}


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
