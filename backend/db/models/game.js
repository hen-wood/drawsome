"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Game extends Model {
		static associate(models) {
			Game.belongsTo(models.User, {
				foreignKey: "creatorId",
				as: "creator"
			});

			Game.hasMany(models.Round, {
				foreignKey: "gameId",
				as: "gameRounds"
			});
		}
	}
	Game.init(
		{
			code: DataTypes.STRING,
			creatorId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Users"
				}
			},
			numRounds: DataTypes.INTEGER,
			timeLimit: DataTypes.INTEGER,
			numPlayers: DataTypes.INTEGER
		},
		{
			sequelize,
			modelName: "Game",
			defaultScope: {
				attributes: [
					"id",
					"code",
					"numPlayers",
					"numRounds",
					"timeLimit",
					"hasStarted",
					"hasEnded",
					"createdAt",
					"updatedAt"
				]
			}
		}
	);
	return Game;
};
