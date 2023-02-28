"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Drawing extends Model {
		static associate(models) {
			Drawing.belongsTo(models.Round, {
				foreignKey: "roundId",
				as: "roundDrawings"
			});

			Drawing.belongsTo(models.User, {
				foreignKey: "userId"
			});

			Drawing.belongsToMany(models.User, {
				through: models.DrawingVote,
				foreignKey: "drawingId",
				otherKey: "voterId"
			});

			Drawing.hasMany(models.DrawingVote, {
				foreignKey: "drawingId",
				as: "Votes"
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
			modelName: "Drawing",

			scopes: {
				roundDrawings() {
					const { DrawingVote } = require("../models");
					return {
						attributes: {
							include: [
								[sequelize.fn("COUNT", sequelize.col("Votes.id")), "numVotes"]
							]
						},
						include: [
							{
								model: DrawingVote,
								as: "Votes",
								attributes: [],
								required: false
							}
						],
						group: ["Drawing.id"]
					};
				}
			}
		}
	);
	return Drawing;
};