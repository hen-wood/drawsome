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
				foreignKey: "userId",
				as: "artist"
			});

			Drawing.hasMany(models.DrawingVote, {
				foreignKey: "drawingId",
				as: "drawingVotes"
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
				},
				onDelete: "CASCADE"
			}
		},
		{
			sequelize,
			modelName: "Drawing",

			scopes: {
				roundDrawings() {
					const { DrawingVote } = require("../models");
					return {
						include: [
							{
								model: DrawingVote,
								as: "drawingVotes",
								attributes: ["id"],
								required: false
							}
						]
					};
				}
			}
		}
	);
	return Drawing;
};
