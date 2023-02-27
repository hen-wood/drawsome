"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Drawing extends Model {
		static associate(models) {
			Drawing.belongsTo(models.Round, {
				foreignKey: "roundId"
			});
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
