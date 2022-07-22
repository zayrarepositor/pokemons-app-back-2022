const { Pokemon, Type } = require("../db.js");
const axios = require("axios");

//AUXILIAR FUNCTIONS
const url = "https://pokeapi.co/api/v2/";

async function pokemonById(id) {
  let res = await axios.get(`${url}/pokemon/${id}/`);
  let poke = res.data;

  if (Object.keys(poke).length > 0) {
    let pokemon = {
      id: poke.id,
      name: poke.name,
      hp: poke.stats[0].base_stat,
      attack: poke.stats[1].base_stat,
      defense: poke.stats[2].base_stat,
      speed: poke.stats[5].base_stat,
      height: poke.height,
      weight: poke.weight,
      types: poke.types.map((t) => t.type.name),
      img: poke.sprites.other["official-artwork"].front_default,
    };
    return pokemon;
  } else {
    throw "pokemon not found";
  }
}

async function apiPokemons(number) {
  try {
    for (let i = 1; i <= number; i++) {
      let poke = await pokemonById(i);

      const [pokeCreated, created] = await Pokemon.findOrCreate({
        where: {
          name: poke.name,
        },
        defaults: {
          hp: poke.hp,
          attack: poke.attack,
          defense: poke.defense,
          speed: poke.speed,
          height: poke.height,
          weight: poke.weight,
          img: poke.img,
        },
      });

      let typematched = await Type.findAll({
        where: {
          name: poke.types,
        },
      });

      if (typematched) await pokeCreated.addTypes(typematched);
    }
    return "db full";
  } catch (error) {
    throw error;
  }
}

async function allPokemons() {
  try {
    let dbPokes = await Pokemon.findAll({
      include: {
        model: Type,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    });

    if (!dbPokes.length) {
      throw "db empty";
    } else {
      let pokesToReturn = dbPokes.map((p) => {
        return {
          id: p.id,
          name: p.name,
          hp: p.hp,
          attack: p.attack,
          defense: p.defense,
          speed: p.speed,
          height: p.height,
          weight: p.weight,
          types: p.types?.map((t) => t.name),
          img: p.img,
          createdByUser: p.createdByUser,
        };
      });
      return pokesToReturn;
    }
  } catch (error) {
    return error;
  }
}

// ROUTE FUNCTIONS
async function getAllPokemons(req, res, next) {
  let { fill, name } = req.query;

  try {
    if (fill) {
      if (fill > 151) {
        return res
          .status(401)
          .send("Sorry, too much pokemons. Try less than 151");
      } else {
        let apiPokes = await apiPokemons(fill);
        return res.status(200).json(apiPokes);
      }
    }

    if (name) {
      let allPokes = await allPokemons();
      let pokeName = name.toLowerCase();
      let pokeFound = allPokes.filter(({ name }) => name === pokeName);

      if (pokeFound.length) {
        return res.status(200).json(pokeFound);
      } else {
        return res.status(404).send("Sorry, pokemon not found");
      }
    }
    let allPokes = await allPokemons();
    return res.status(200).json(allPokes);
  } catch (err) {
    next(err);
  }
}

async function getPokemonById(req, res, next) {
  try {
    let { id } = req.params;

    let poke = await pokemonById(id);
    res.status(200).json(poke);
  } catch (err) {
    next(err);
  }
}

async function createPokemon(req, res, next) {
  try {
    const { name, hp, attack, defense, speed, height, weight, types, img } =
      req.body;

    const newPoke = await Pokemon.create({
      name,
      hp,
      attack,
      defense,
      speed,
      height,
      weight,
      types,
      img,
      createdByUser: true,
    });

    let typematched = await Type.findAll({
      where: {
        name: types,
      },
    });

    await newPoke.addTypes(typematched);

    let pokeCreated = await Pokemon.findOne({
      where: { name },
      include: {
        model: Type,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    });

    let pokemonCreatedToReturn = [];
    pokemonCreatedToReturn.push(pokeCreated);

    let pokemonToReturn = pokemonCreatedToReturn.map((p) => {
      return {
        id: p.id,
        name: p.name,
        hp: p.hp,
        attack: p.attack,
        defense: p.defense,
        speed: p.speed,
        height: p.height,
        weight: p.weight,
        types: p.types?.map((t) => t.name),
        img: p.img,
        createdByUser: p.createdByUser,
      };
    });

    res.status(201).send({
      msg: `Great! You has created pokemon #${pokemonToReturn[0].id}!!`,
      pokemonToReturn,
    });
  } catch (err) {
    next(err);
  }
}

async function deletePokemon(req, res, next) {
  let { id } = req.params;
  try {
    if (!id) {
      res.status(404).json({ msg: "Send id number" });
    } else {
      await Pokemon.destroy({
        where: {
          id: id,
        },
      });
      res.status(301).json({ msg: `Ooh! You has deleted pokemon #${id}!!` });
    }
  } catch (err) {
    next(err);
  }
}

async function updatePokemon(req, res, next) {
  let { id } = req.params;

  try {
    if (!id) {
      res.status(400).json({ msg: "Send id number" });
    } else {
      let poke = await Pokemon.findOne({
        where: { id },
        include: {
          model: Type,
          attributes: ["name"],
          through: {
            attributes: [],
          },
        },
      });
      poke.set(req.body);
      await poke.save();
      let pokeUpdated = [];
      pokeUpdated.push(poke);
      let pokeToReturn = pokeUpdated.map((p) => {
        return {
          id: p.id,
          name: p.name,
          hp: p.hp,
          attack: p.attack,
          defense: p.defense,
          speed: p.speed,
          height: p.height,
          weight: p.weight,
          types: p.types?.map((t) => t.name),
          img: p.img,
          createdByUser: p.createdByUser,
        };
      });
      res.status(202).json({
        msg: `Ooh! You has updated pokemon #${pokeToReturn.id}!!`,
        pokeToReturn,
      });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createPokemon,
  getAllPokemons,
  getPokemonById,
  deletePokemon,
  updatePokemon,
};
