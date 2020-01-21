import {getPosition, IMatch, IMatchReference} from '../src/app/riotapi.types';

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
    const matchRefs = await this.getMatchesOfAccountId(accountId);
    const match = await this.getRandomValidMatchOfAccountId(matchRefs);
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

  async getMatchesOfAccountId(encryptedAccountId: string): Promise<IMatchReference[]> {
    const queue = 420; // ranked 5v5
    const url = `${this.domain}/lol/match/v4/matchlists/by-account/${encryptedAccountId}?queue=${queue}`;
    const matchRefs = (await axios.get(url, this.defaultParams)).data.matches;
    if (matchRefs.length === 0) { throw new RetryError('No recent ranked matches found for this account'); }
    return matchRefs;
  }
  async getRandomValidMatchOfAccountId(matchRefs: IMatchReference[]): Promise<IMatch> {
    shuffleArray(matchRefs);
    matchRefs = matchRefs.slice(0, 10); // trim to get some newer games
    for (const matchRef of matchRefs) {
      const url = `${this.domain}/lol/match/v4/matches/${matchRef.gameId}`;
      // const url = `${this.domain}/lol/match/v4/matches/4336510853`;
      const match: IMatch = (await axios.get(url, this.defaultParams)).data;

      const positions = [];
      let hasDuplicate = false;
      for (const participant of match.participants) {
        if (participant.teamId === 200) {
          const pos = getPosition(participant.timeline);
          if (positions.includes(pos)) {
            hasDuplicate = true;
            break;
          }
          positions.push(pos);
        }
      }
      if (hasDuplicate) { continue; }
      return match;
    }
    throw new RetryError('No valid match found.');
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

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

class RetryError extends Error {}
