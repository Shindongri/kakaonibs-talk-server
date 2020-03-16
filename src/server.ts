import * as express from 'express'
import * as path from 'path'
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app: express.Application = express()

const ws = require('./socket')
const routes = require('./routes')

/* Connect to Mongo DB */
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.MONGO_DB,
  },
  error => {
    if (error) {
      console.log('DB Connection Fail.', error)
    } else {
      console.log('DB Connection success.')
    }
  },
)

const PORT = process.env.PORT || 8080
const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 60 * 60 * 1,
  }),
  cookie: {
    path: '/',
    secure: false,
    httpOnly: true,
    maxAge: null,
  },
})

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
)

app.use('/image', express.static(path.resolve(__dirname, '../uploads')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(sessionMiddleware)
app.use(flash())

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN)
  res.setHeader('Access-Control-Expose-Headers', 'X-Requested-With')
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Max-Age', 3600)
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,Accept,X-Requested-With,Content-Type,Authorization,Access-Control-Request-Method,Access-Control-Request-Headers',
  )

  next()
})

app.use('/', routes)

const server = app.listen(PORT, () => {
  console.log(`Running on ${PORT}`)
})

ws(server, app, sessionMiddleware)
