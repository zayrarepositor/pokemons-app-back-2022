const express = require("express");

const {
  createPokemon,
  getPokemonById,
  getAllPokemons,
  deletePokemon,
  updatePokemon,
} = require("../controllers/pokemons.controllers");

const pokemons = express.Router();

// ROUTES

pokemons.get("/pokemons", getAllPokemons);

pokemons.get("/pokemons/:id", getPokemonById);

pokemons.post("/pokemons", createPokemon);

pokemons.delete("/pokemons/:id", deletePokemon);

pokemons.put("/pokemons/:id", updatePokemon);

module.exports = pokemons;
