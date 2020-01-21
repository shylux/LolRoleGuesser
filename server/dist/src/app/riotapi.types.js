"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Positions;
(function (Positions) {
    Positions[Positions["TOP"] = 0] = "TOP";
    Positions[Positions["JUNGLE"] = 1] = "JUNGLE";
    Positions[Positions["MID"] = 2] = "MID";
    Positions[Positions["BOT"] = 3] = "BOT";
    Positions[Positions["SUPPORT"] = 4] = "SUPPORT";
})(Positions = exports.Positions || (exports.Positions = {}));
exports.POSITION_NAMES = ['Top', 'Jungle', 'Mid', 'Bot', 'Support'];
exports.TIERS = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];
exports.DIVISIONS = ['IV', 'III', 'II', 'I'];
function getPosition(timeline) {
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
            }
            else {
                return Positions.BOT;
            }
    }
}
exports.getPosition = getPosition;
