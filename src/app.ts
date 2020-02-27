require('dotenv').config()

import * as express from 'express';

const app: express.Application = express();
const serverless = require('serverless-http');
const routes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', routes);

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Expose-Headers', 'x-total-count');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type,authorization');

  next();
});

module.exports = app;
module.exports.handler = serverless(app);
