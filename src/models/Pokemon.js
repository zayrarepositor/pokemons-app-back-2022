const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "pokemon",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEven(value) {
            if (value.length < 2 || value.length > 20) {
              throw new Error("pokemon's name must be 2 - 20 characters");
            }
          },
        },
      },
      hp: {
        type: DataTypes.INTEGER,
        validate: {
          checkRange(value) {
            if (value < 1 || value > 255) {
              throw new Error("pokemon hit points must be 1 - 255");
            }
          },
        },
      },
      attack: {
        type: DataTypes.INTEGER,
        validate: {
          checkRange(value) {
            if (value < 1 || value > 255) {
              throw new Error("pokemon attack must be 1 - 255 points");
            }
          },
        },
      },
      defense: {
        type: DataTypes.INTEGER,
        validate: {
          checkRange(value) {
            if (value < 1 || value > 255) {
              throw new Error("pokemon defense must be 1 - 255 points");
            }
          },
        },
      },
      speed: {
        type: DataTypes.INTEGER,
        validate: {
          checkRange(value) {
            if (value < 1 || value > 255) {
              throw new Error("pokemon speed must be 1 - 255 points");
            }
          },
        },
      },
      height: {
        type: DataTypes.INTEGER,
        validate: {
          checkRange(value) {
            if (value < 1 || value > 255) {
              throw new Error("pokemon height must be 1 - 255");
            }
          },
        },
      },
      weight: {
        type: DataTypes.INTEGER,
        validate: {
          checkRange(value) {
            if (value < 1 || value > 1000) {
              throw new Error("your pokemon weight must be 1 - 255");
            }
          },
        },
      },
      img: {
        type: DataTypes.STRING,
        defaultValue:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/92.png",
      },
      createdByUser: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
