"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Drawing extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Drawing.init(
		{
			userId: {
				type: DataTypes.INTEGER,
				references: { model: "Users" },
				allowNull: false
			},
			title: {
				type: DataTypes.STRING
			},
			drawingUrl: { type: DataTypes.STRING, allowNull: false },
			roundId: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: "Rounds"
				}
			}
		},
		{
			sequelize,
			modelName: "Drawing"
		}
	);
	return Drawing;
};
