"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios').default;
class RiotAPI {
    constructor(apiKey, domain) {
        this.defaultParams = {
            params: {
                api_key: null
            }
        };
        this.defaultParams.params.api_key = apiKey;
        this.domain = domain;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.gameVersion) {
                this.gameVersion = yield this.loadGameVersion();
            }
        });
    }
    getRandomGame(tier, division) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initialize();
            const encryptedSummonerId = yield this.getRandomSummonerInSelectedLeague(tier, division);
            const accountId = yield this.getAccoundIdFromSummonerId(encryptedSummonerId);
            const matchId = yield this.getRandomMatchOfAccountId(accountId);
            const match = yield this.getMatch(matchId);
            return match;
        });
    }
    getRandomSummonerInSelectedLeague(tier, division, queue = 'RANKED_SOLO_5x5') {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.domain}/lol/league/v4/entries/${queue}/${tier}/${division}`;
            const summoners = (yield axios.get(url, this.defaultParams)).data;
            return summoners[Math.floor(Math.random() * summoners.length)].summonerId;
        });
    }
    getAccoundIdFromSummonerId(encryptedSummonerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.domain}/lol/summoner/v4/summoners/${encryptedSummonerId}`;
            const account = (yield axios.get(url, this.defaultParams)).data;
            return account.accountId;
        });
    }
    getRandomMatchOfAccountId(encryptedAccountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const queue = 420; // ranked 5v5
            const url = `${this.domain}/lol/match/v4/matchlists/by-account/${encryptedAccountId}`;
            const matchesResult = (yield axios.get(url, this.defaultParams)).data;
            let matches = matchesResult.matches.filter((match) => match.queue === queue); // filter matches to only contain ranked games
            matches = matches.slice(0, 5); // trim to get some newer games
            if (matches.length === 0) {
                throw new Error('No recent ranked matches found for this account');
            }
            return matches[Math.floor(Math.random() * matches.length)].gameId;
        });
    }
    getMatch(matchId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.domain}/lol/match/v4/matches/${matchId}`;
            const match = (yield axios.get(url, this.defaultParams)).data;
            return match;
        });
    }
    loadGameVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            const versions = (yield axios.get('https://ddragon.leagueoflegends.com/api/versions.json')).data;
            return versions[0];
        });
    }
}
exports.RiotAPI = RiotAPI;
