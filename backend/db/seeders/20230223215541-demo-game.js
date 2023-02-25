"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}
const crypto = require("crypto");

function hashNumberToCode(number) {
	const hash = crypto.createHash("sha256").update(number.toString()).digest();
	const code = hash.toString("base64").slice(0, 5);
	return code;
}

module.exports = {
	up: async (queryInterface, Sequelize) => {
		options.tableName = "Games";
		return queryInterface.bulkInsert(
			options,
			[
				{
					code: hashNumberToCode(1),
					creatorId: 1,
					numRounds: 2,
					timeLimit: 2,
					numPlayers: 3
				},
				{
					code: hashNumberToCode(2),
					creatorId: 1,
					numRounds: 2,
					timeLimit: 2,
					numPlayers: 4
				},
				{
					code: hashNumberToCode(3),
					creatorId: 1,
					numRounds: 2,
					timeLimit: 2,
					numPlayers: 4
				},
				{
					code: hashNumberToCode(4),
					creatorId: 1,
					numRounds: 2,
					timeLimit: 2,
					numPlayers: 4
				}
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		options.tableName = "Games";
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(
			options,
			{
				creatorId: { [Op.gte]: 1 }
			},
			{}
		);
	}
};
