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

			Game.belongsToMany(models.User, {
				through: models.Player,
				foreignKey: "gameId",
				otherKey: "userId",
				as: "players"
			});
		}
	}
	Game.init(
		{
			code: { type: DataTypes.STRING, allowNull: false },
			creatorId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: "Users" },
				onDelete: "CASCADE"
			},
			numRounds: { type: DataTypes.INTEGER, allowNull: false },
			timeLimit: { type: DataTypes.INTEGER, allowNull: false },
			numPlayers: { type: DataTypes.INTEGER, allowNull: false },
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
					"creatorId",
					"numPlayers",
					"numRounds",
					"timeLimit",
					"hasStarted",
					"hasEnded"
				]
			}
		}
	);
	return Game;
};
