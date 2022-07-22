const express = require("express");

const { getAllTypes } = require("../controllers/types.controllers.js");

const types = express.Router();

// ROUTE

types.get("/types", getAllTypes);

module.exports = types;
