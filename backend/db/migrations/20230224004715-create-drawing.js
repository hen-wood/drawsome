"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA;
}

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"Drawings",
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				userId: {
					type: Sequelize.INTEGER,
					references: {
						model: "Users"
					}
				},
				title: {
					type: Sequelize.STRING,
					allowNull: false
				},
				drawingUrl: {
					type: Sequelize.STRING,
					allowNull: false
				},
				roundId: {
					type: Sequelize.INTEGER,
					references: {
						model: "Rounds"
					},
					allowNull: true
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
		options.tableName = "Drawings";
		await queryInterface.dropTable(options);
	}
};
