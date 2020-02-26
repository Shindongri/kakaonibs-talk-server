require('dotenv').config();

import app from './app';

const PORT = process.env.PORT || 8080;

(async () => {
  app.listen(PORT,() => {
    console.log(`Running on ${ PORT } PORT`);
  })
})()
