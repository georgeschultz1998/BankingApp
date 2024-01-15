// Author: Anthony Schultz
// Date: 4/28/23
// Description: This file is the entry point of the application. It sets up the environment
// variables, establishes a connection to the MongoDB database, and starts the Express server.
// The server listens for incoming requests on the specified port.


const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

const app = require('./app');

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});


