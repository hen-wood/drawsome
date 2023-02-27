"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Round extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Round.belongsTo(models.User, {
				foreignKey: "gameId",
				as: "gameRounds"
			});
		}
	}
	Round.init(
		{
			gameId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Games"
				}
			},
			prompt: DataTypes.STRING,
			roundNumber: DataTypes.INTEGER
		},
		{
			sequelize,
			modelName: "Round"
		}
	);
	return Round;
};
