import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import cors from "cors";
import tokenRouter from './utilities/generateToken';

const app: express.Application = express();
const address: string = '127.0.0.1:3000';

app.use(bodyParser.json());

const corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }
app.use(cors(corsOptions));

app.use('/api', routes);

app.use('/authentication', tokenRouter);

app.listen(3000, () => console.log(`starting app on: ${address}`));
