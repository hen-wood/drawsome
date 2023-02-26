// backend/routes/api/games.js
const express = require("express");
const { requireAuthentication } = require("../../utils/auth");
const { Drawing, Game, Round, User } = require("../../db/models");
const { codeGen } = require("../../utils/codeGen");
const { Op } = require("sequelize");

const router = express.Router();

// GET single game
router.get("/:gameCode", requireAuthentication, async (req, res, next) => {
	const { gameCode } = req.params;

	const game = await Game.findOne({
		where: {
			code: gameCode
		},
		include: [
			{
				model: User,
				as: "creator"
			},
			{
				model: Round,
				as: "gameRounds",
				attributes: ["id", "gameId", "prompt", "roundNumber"]
			}
		]
	});
	if (!game) {
		return res.status(404).json({
			message: "Game not found"
		});
	}

	return res.json(game);
});

// POST create new game
router.post("/", requireAuthentication, async (req, res, next) => {
	const creatorId = req.user.id;
	const { numRounds, timeLimit, numPlayers, rounds } = req.body;
	const newGame = await Game.create({
		code: "dfalt",
		creatorId,
		numRounds,
		timeLimit,
		numPlayers
	});

	const gameId = newGame.id;
	newGame.code = await codeGen(gameId);
	await newGame.save();
	rounds.forEach(async round => {
		const { prompt, roundNumber } = round;
		await Round.create({ gameId, prompt, roundNumber });
	});

	return res.json(newGame);
});

// PUT start game
router.put("/:gameId/start", requireAuthentication, async (req, res, next) => {
	const { gameId } = req.params;
	const gameToStart = await Game.findByPk(gameId);
	gameToStart.hasStarted = true;
	const resBody = await gameToStart.save();
	return res.json(resBody);
});

module.exports = router;
