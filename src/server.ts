import * as express from 'express';

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
require('dotenv').config();

const app: express.Application  = express();

const ws = require('./socket');
const routes = require('./routes');

/* Connect to Mongo DB */
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'admin',
}, (error) => {
  if (error) {
    console.log('DB Connection Fail.', error);
  } else {
    console.log('DB Connection success.');
  }
});

const PORT = process.env.PORT || 8080;
const sessionMiddleware = session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.COOKIE_SECRET,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 60 * 60
  }),
  cookie : {
    secure: false
  }
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);
app.use(flash());

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Expose-Headers', 'X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Max-Age', 3600);
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin,Accept,X-Requested-With,Content-Type,Authorization,Access-Control-Request-Method,Access-Control-Request-Headers');

  next();
});

app.use('/', routes);

const server = app.listen(PORT, () => {
  console.log(`Running on ${ PORT }`)
});

ws(server, app, sessionMiddleware);

