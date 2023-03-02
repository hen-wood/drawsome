"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA;
}

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"Rounds",
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
					},
					onDelete: "CASCADE"
				},
				prompt: {
					type: Sequelize.STRING,
					allowNull: false
				},
				roundNumber: {
					type: Sequelize.INTEGER,
					allowNull: false
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
		await queryInterface.dropTable("Rounds");
	}
};
