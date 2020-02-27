require('dotenv').config();

const PORT = process.env.PORT || 8080

const ws = require('./socket');
const app = require('./app');

const server = app.listen(PORT, () => {
  console.log(`Running on ${ PORT }`)
});

ws(server);
