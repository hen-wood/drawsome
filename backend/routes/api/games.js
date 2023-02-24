// backend/routes/api/games.js
const express = require("express");
const { requireAuthentication } = require("../../utils/auth");
const { Drawing, Game, Round } = require("../../db/models");
const { codeGen } = require("../../utils/codeGen");
const { Op } = require("sequelize");

const router = express.Router();

// GET single game
router.get("/:gameCode", requireAuthentication, async (req, res, next) => {
	const { gameCode } = req.params;

	const game = await Game.findOne({
		where: {
			[Op.and]: [{ code: gameCode }, { hasStarted: false }, { hasEnded: false }]
		}
	});
	console.log(game);
	if (!game) {
		return res.json({
			message: "game not found. it may have ended or started without you"
		});
	}

	return res.json(game);
});

// POST create new game
router.post("/", requireAuthentication, async (req, res, next) => {
	const creatorId = req.user.id;
	const { code, numRounds, timeLimit, numPlayers, rounds } = req.body;
	console.log(req.body);
	const newGame = await Game.create({
		code,
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

module.exports = router;
