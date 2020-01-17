"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const riotapi_1 = require("./riotapi");
dotenv.config();
const PORT = parseInt(process.env.PORT, 10);
const RIOT_API_KEY = process.env.RIOT_API_KEY;
const app = express();
const api = new riotapi_1.RiotAPI(RIOT_API_KEY, 'https://euw1.api.riotgames.com');
app.use(helmet());
app.use(cors());
app.use(express.static('.'));
app.get('/match', (req, res) => {
    api.getRandomGame('GOLD', 'I').then((match) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(match);
    });
});
const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
