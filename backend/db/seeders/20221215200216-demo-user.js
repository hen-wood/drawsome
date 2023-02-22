"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
	up: async (queryInterface, Sequelize) => {
		options.tableName = "Users";
		return queryInterface.bulkInsert(
			options,
			[
				// Group Organizers
				{
					email: "demo@user.io",
					username: "Demo-lition",
					hashedPassword: bcrypt.hashSync("password")
				},
				{
					email: "john@user.io",
					username: "JohnFakeman",
					hashedPassword: bcrypt.hashSync("password2")
				},
				{
					email: "don@user.io",
					username: "DonManfake",
					hashedPassword: bcrypt.hashSync("password3")
				},
				{
					email: "jane@user.io",
					username: "JaneDoe",
					hashedPassword: bcrypt.hashSync("password4")
				},
				{
					email: "bob@user.io",
					username: "BobSmith",
					hashedPassword: bcrypt.hashSync("password5")
				},
				// Extra members
				// New Yorkers
				{
					email: "emily@user.io",
					username: "EmilyWilliams",
					hashedPassword: bcrypt.hashSync("password6")
				},
				{
					email: "whomikejones@user.io",
					username: "whoMikeJones",
					hashedPassword: bcrypt.hashSync("password7")
				},
				{
					email: "ashley@user.io",
					username: "AshleyBrown",
					hashedPassword: bcrypt.hashSync("password8")
				},
				// Seattle-ites
				{
					email: "josh@user.io",
					username: "JoshuaGarcia",
					hashedPassword: bcrypt.hashSync("password9")
				},
				{
					email: "matthew@user.io",
					username: "MatthewDavis",
					hashedPassword: bcrypt.hashSync("password10")
				},
				{
					email: "lauren@user.io",
					username: "LaurenConner",
					hashedPassword: bcrypt.hashSync("password11")
				}
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		options.tableName = "Users";
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(
			options,
			{
				username: { [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2"] }
			},
			{}
		);
	}
};
