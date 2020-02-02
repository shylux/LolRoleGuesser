import dotenv = require('dotenv');
import express = require('express');
import cors = require('cors');
import helmet = require('helmet');
import {RiotAPI} from './riotapi';
import {DIVISIONS, TIERS, TIERS_UPPER} from '../src/app/riotapi.types';

dotenv.config();

const PORT: number = parseInt(process.env.PORT as string, 10);
const RIOT_API_KEY: string = process.env.RIOT_API_KEY as string;

const app = express();
const api = new RiotAPI(RIOT_API_KEY, 'https://euw1.api.riotgames.com');

app.use(helmet());
app.use(cors());

app.use(express.static('.'));

app.get('/match', (req, res) => {
  const tier = TIERS_UPPER.indexOf(req.query.tier.toUpperCase()) > -1 ? req.query.tier.toUpperCase() : 'GOLD';
  const division = DIVISIONS.indexOf(req.query.division) > -1 ? req.query.division : 'I';

  res.setHeader('Content-Type', 'application/json');
  api.getRandomGame(tier, division)
    .then((match) => {
      res.send(match);
    })
    .catch((reason) => {
      res.send({error: reason.constructor.name, message: reason.toString()});
    });
});

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
