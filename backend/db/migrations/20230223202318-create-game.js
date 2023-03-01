"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA;
}

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"Games",
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				code: {
					type: Sequelize.STRING,
					unique: true
				},
				creatorId: {
					type: Sequelize.INTEGER,
					references: {
						model: "Users"
					},
					onDelete: "CASCADE"
				},
				numRounds: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				timeLimit: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				numPlayers: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				hasStarted: {
					allowNull: false,
					type: Sequelize.BOOLEAN,
					defaultValue: false
				},
				hasEnded: {
					allowNull: false,
					type: Sequelize.BOOLEAN,
					defaultValue: false
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
		await queryInterface.dropTable("Games");
	}
};
