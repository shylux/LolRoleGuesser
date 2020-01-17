import dotenv = require('dotenv');
import express = require('express');
import cors = require('cors');
import helmet = require('helmet');
import {RiotAPI} from './riotapi';

dotenv.config();

const PORT: number = parseInt(process.env.PORT as string, 10);
const RIOT_API_KEY: string = process.env.RIOT_API_KEY as string;

const app = express();
const api = new RiotAPI(RIOT_API_KEY, 'https://euw1.api.riotgames.com');

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
