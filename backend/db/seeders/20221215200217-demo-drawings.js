"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
	up: async (queryInterface, Sequelize) => {
		options.tableName = "Drawings";
		return queryInterface.bulkInsert(
			options,
			[
				{
					userId: 1,
					title: "Burger King",
					drawingUrl:
						"https://drawsome-images.s3.amazonaws.com/1680580934920.png"
				},
				{
					userId: 1,
					title: "Pizza",
					drawingUrl:
						"https://drawsome-images.s3.amazonaws.com/1680586345086.png"
				},
				{
					userId: 1,
					title: "Moonrise",
					drawingUrl:
						"https://drawsome-images.s3.us-west-2.amazonaws.com/1680588432506.png"
				},
				{
					userId: 1,
					title: "Banana",
					drawingUrl:
						"https://drawsome-images.s3.us-west-2.amazonaws.com/1680591840277.png"
				},
				{
					userId: 1,
					title: "Lambo",
					drawingUrl:
						"https://drawsome-images.s3.amazonaws.com/1680631897149.png"
				}
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		options.tableName = "Drawings";
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(
			options,
			{
				userId: { [Op.gte]: 1 }
			},
			{}
		);
	}
};
