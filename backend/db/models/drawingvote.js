"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class DrawingVote extends Model {
		static associate(models) {
			DrawingVote.belongsTo(models.Drawing, {
				foreignKey: "drawingId",
				as: "drawingVotes"
			});
			DrawingVote.belongsTo(models.User, {
				foreignKey: "votedForId",
				as: "playerVotes"
			});
		}
	}
	DrawingVote.init(
		{
			gameId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Games"
				}
			},
			drawingId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Drawings",
					as: "drawingVotes"
				}
			},
			votedForId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Players",
					as: "playerVotes"
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
