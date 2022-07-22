/* if (process.env.NODE_ENV !== "produccion") {
  require("dotenv").config();
} */

const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
//CONFIG VAR CREATED IN HEROKU
const { CORS_URL } = process.env;
//ROUTES FROM INDEX.JS/ROUTES
const { pokemons, types } = require("./routes/index.js");
//CORS
const cors = require("cors");

require("./db.js");

//INITIALIZATION
const server = express();
server.name = "API";

//MIDDLEWARES
server.use(cors());
server.use(express.json());
//extended true?
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
//HTTP request logger
server.use(morgan("dev"));
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", CORS_URL); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
//ROUTES
server.use(pokemons);
server.use(types);

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
