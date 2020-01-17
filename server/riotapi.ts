import {IMatch} from '../src/app/riotapi.types';
const axios = require('axios').default;


export class RiotAPI {

  private gameVersion: string;

  private readonly domain: string;

  private defaultParams = {
    params: {
      api_key: null
    }
  };

  constructor(apiKey: string, domain: string) {
    this.defaultParams.params.api_key = apiKey;
    this.domain = domain;
  }

  async initialize() {
    if (!this.gameVersion) {
      this.gameVersion = await this.loadGameVersion();
    }
  }

  async getRandomGame(tier: string, division: string): Promise<IMatch> {
    await this.initialize();
    const encryptedSummonerId = await this.getRandomSummonerInSelectedLeague(tier, division);
    const accountId = await this.getAccoundIdFromSummonerId(encryptedSummonerId);
    const matchId = await this.getRandomMatchOfAccountId(accountId);
    const match = await this.getMatch(matchId);
    return match as IMatch;
  }

  async getRandomSummonerInSelectedLeague(tier: string, division: string, queue = 'RANKED_SOLO_5x5'): Promise<string> {
    const url = `${this.domain}/lol/league/v4/entries/${queue}/${tier}/${division}`;
    const summoners = (await axios.get(url, this.defaultParams)).data;

    return summoners[Math.floor(Math.random() * summoners.length)].summonerId;
  }

  async getAccoundIdFromSummonerId(encryptedSummonerId: string): Promise<string> {
    const url = `${this.domain}/lol/summoner/v4/summoners/${encryptedSummonerId}`;
    const account = (await axios.get(url, this.defaultParams)).data;
    return account.accountId;
  }

  async getRandomMatchOfAccountId(encryptedAccountId: string): Promise<string> {
    const queue = 420; // ranked 5v5
    const url = `${this.domain}/lol/match/v4/matchlists/by-account/${encryptedAccountId}`;
    const matchesResult = (await axios.get(url, this.defaultParams)).data;

    let matches = matchesResult.matches.filter((match) => match.queue === queue); // filter matches to only contain ranked games
    matches = matches.slice(0, 5); // trim to get some newer games
    if (matches.length === 0) { throw new Error('No recent ranked matches found for this account'); }
    return matches[Math.floor(Math.random() * matches.length)].gameId;
  }

  async getMatch(matchId: string): Promise<IMatch> {
    const url = `${this.domain}/lol/match/v4/matches/${matchId}`;
    const match = (await axios.get(url, this.defaultParams)).data;
    return match as IMatch;
  }

  async loadGameVersion(): Promise<string> {
    const versions = (await axios.get('https://ddragon.leagueoflegends.com/api/versions.json')).data;
    return versions[0];
  }
}
