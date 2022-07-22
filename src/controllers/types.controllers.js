const { Type } = require("../db.js");
const axios = require("axios");
const url = "https://pokeapi.co/api/v2/";

//AUXILIAR FUNCTIONS
async function pokeTypes() {
  try {
    let apiTypes = await axios.get(url + "type");

    let typeNames = apiTypes.data.results.map((type) => {
      return { name: type.name };
    });

    await Type.bulkCreate(typeNames);

    let dbTypes = await Type.findAll({ attributes: ["name"] });
    return dbTypes;
  } catch (e) {
    console.log(e);
  }
}

//ROUTE FUNCTION
async function getAllTypes(req, res, next) {
  try {
    const types = await pokeTypes();
    res.status(200).json(await Type.findAll({ attributes: ["name"] }));
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllTypes };
