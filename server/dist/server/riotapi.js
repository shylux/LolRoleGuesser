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
const riotapi_types_1 = require("../src/app/riotapi.types");
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
            const matchRefs = yield this.getMatchesOfAccountId(accountId);
            const match = yield this.getRandomValidMatchOfAccountId(matchRefs);
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
    getMatchesOfAccountId(encryptedAccountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const queue = 420; // ranked 5v5
            const url = `${this.domain}/lol/match/v4/matchlists/by-account/${encryptedAccountId}?queue=${queue}`;
            const matchRefs = (yield axios.get(url, this.defaultParams)).data.matches;
            if (matchRefs.length === 0) {
                throw new RetryError('No recent ranked matches found for this account');
            }
            return matchRefs;
        });
    }
    getRandomValidMatchOfAccountId(matchRefs) {
        return __awaiter(this, void 0, void 0, function* () {
            shuffleArray(matchRefs);
            matchRefs = matchRefs.slice(0, 10); // trim to get some newer games
            for (const matchRef of matchRefs) {
                const url = `${this.domain}/lol/match/v4/matches/${matchRef.gameId}`;
                // const url = `${this.domain}/lol/match/v4/matches/4336510853`;
                const match = (yield axios.get(url, this.defaultParams)).data;
                const positions = [];
                let hasDuplicate = false;
                for (const participant of match.participants) {
                    if (participant.teamId === 200) {
                        const pos = riotapi_types_1.getPosition(participant.timeline);
                        if (positions.includes(pos)) {
                            hasDuplicate = true;
                            break;
                        }
                        positions.push(pos);
                    }
                }
                if (hasDuplicate) {
                    continue;
                }
                return match;
            }
            throw new RetryError('No valid match found.');
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
/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
class RetryError extends Error {
}
