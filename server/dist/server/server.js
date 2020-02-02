"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const riotapi_1 = require("./riotapi");
const riotapi_types_1 = require("../src/app/riotapi.types");
dotenv.config();
const PORT = parseInt(process.env.PORT, 10);
const RIOT_API_KEY = process.env.RIOT_API_KEY;
const app = express();
const api = new riotapi_1.RiotAPI(RIOT_API_KEY, 'https://euw1.api.riotgames.com');
app.use(helmet());
app.use(cors());
app.use(express.static('.'));
app.get('/match', (req, res) => {
    const tier = riotapi_types_1.TIERS_UPPER.indexOf(req.query.tier.toUpperCase()) > -1 ? req.query.tier.toUpperCase() : 'GOLD';
    const division = riotapi_types_1.DIVISIONS.indexOf(req.query.division) > -1 ? req.query.division : 'I';
    res.setHeader('Content-Type', 'application/json');
    api.getRandomGame(tier, division)
        .then((match) => {
        res.send(match);
    })
        .catch((reason) => {
        res.send({ error: reason.constructor.name, message: reason.toString() });
    });
});
const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
