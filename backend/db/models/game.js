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
			code: { type: DataTypes.STRING, allowNull: false },
			creatorId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: "Users" }
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
