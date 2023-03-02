"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Round extends Model {
		static associate(models) {
			Round.belongsTo(models.Game, {
				foreignKey: "gameId",
				as: "gameRounds"
			});
			Round.hasMany(models.Drawing, {
				foreignKey: "roundId",
				as: "roundDrawings"
			});
		}
	}
	Round.init(
		{
			gameId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: "Games" }
			},
			prompt: { type: DataTypes.STRING, allowNull: false },
			roundNumber: { type: DataTypes.INTEGER, allowNull: false }
		},
		{
			sequelize,
			modelName: "Round"
		}
	);
	return Round;
};
