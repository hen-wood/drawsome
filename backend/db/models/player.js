"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Player extends Model {
		static associate(models) {
			Player.belongsTo(models.Game, {
				foreignKey: "gameId"
			});
			Player.belongsTo(models.User, {
				foreignKey: "userId"
			});
		}
	}
	Player.init(
		{
			gameId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Games"
				}
			},
			userId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Users"
				}
			}
		},
		{
			sequelize,
			modelName: "Player"
		}
	);
	return Player;
};
