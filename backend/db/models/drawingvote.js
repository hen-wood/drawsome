"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class DrawingVote extends Model {
		static associate(models) {
			DrawingVote.belongsTo(models.Drawing, {
				foreignKey: "drawingId",
				as: "votes"
			});
			DrawingVote.belongsTo(models.User, {
				foreignKey: "voterId"
			});
		}
	}
	DrawingVote.init(
		{
			drawingId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Drawings",
					as: "votes"
				}
			},
			voterId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Users"
				}
			}
		},
		{
			sequelize,
			modelName: "DrawingVote"
		}
	);
	return DrawingVote;
};
