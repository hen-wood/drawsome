"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA;
}

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"DrawingVotes",
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				gameId: {
					type: Sequelize.INTEGER,
					references: {
						model: "Games"
					}
				},
				drawingId: {
					type: Sequelize.INTEGER,
					references: {
						model: "Drawings"
					},
					onDelete: "CASCADE"
				},
				votedForId: {
					type: Sequelize.INTEGER,
					references: {
						model: "Users"
					},
					onDelete: "CASCADE"
				},
				createdAt: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
				},
				updatedAt: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
				}
			},
			options
		);
	},
	async down(queryInterface, Sequelize) {
		options.tableName = "DrawingVotes";
		await queryInterface.dropTable(options);
	}
};
