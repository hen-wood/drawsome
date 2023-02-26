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
			creatorId: DataTypes.INTEGER,
			numRounds: DataTypes.INTEGER,
			timeLimit: DataTypes.INTEGER,
			numPlayers: DataTypes.INTEGER,
			hasStarted: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: false
			},
			hasEnded: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: false
			}
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
