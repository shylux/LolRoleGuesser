import {Injectable} from '@angular/core';
import * as $ from 'jquery';
import {environment} from '../environments/environment';
import {IChampion, IMatch} from './riotapi.types';

@Injectable({
  providedIn: 'root'
})
export class RiotAPIService {

  private gameVersion: string;
  private champions = {};

  private ajaxDefaultSettings = {
    dataType: 'json',
  };

  constructor() {
  }

  async initialize() {
    if (!this.gameVersion) {
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
    const match = await $.getJSON('/match');
    return match as IMatch;
  }


  async loadGameVersion(): Promise<string> {
    const versions = await $.getJSON('https://ddragon.leagueoflegends.com/api/versions.json');
    return versions[0];
  }

  async loadChampions(): Promise<object> {
    const champion = await $.getJSON(`https://ddragon.leagueoflegends.com/cdn/${this.gameVersion}/data/en_US/champion.json`);
    const champions = {};
    for (const champ of Object.values<any>(champion.data)) {
      champions[+champ.key] = champ;
    }
    return champions;
  }
}
