// backend/routes/api/games.js
const express = require("express");
const { requireAuthentication } = require("../../utils/auth");
const {
	Drawing,
	Game,
	Round,
	User,
	DrawingVote,
	Player
} = require("../../db/models");
const { codeGen } = require("../../utils/codeGen");
const { Op, Model, Sequelize } = require("sequelize");

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
	} else if (game.hasEnded) {
		return res.status(401).json({
			message: "That game is over..."
		});
	} else if (game.hasStarted) {
		return res.status(403).json({
			message: "That started without you..."
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
	newGame.code = codeGen(gameId);
	await newGame.save();
	await Player.create({ gameId, userId: creatorId });
	const resBody = newGame.toJSON();
	resBody.gameRounds = [];
	for (let round of rounds) {
		const { prompt, roundNumber } = round;
		const newRound = await Round.create({ gameId, prompt, roundNumber });
		resBody.gameRounds.push(newRound.toJSON());
	}

	return res.json(resBody);
});

// POST add new player
router.post(
	"/:gameId/players",
	requireAuthentication,
	async (req, res, next) => {
		const { gameId } = req.params;
		const { userId } = req.body;
		await Player.create({
			gameId,
			userId
		});
		return res.json({ message: "player added" });
	}
);

// PUT start game
router.put("/:gameId/start", requireAuthentication, async (req, res, next) => {
	const { gameId } = req.params;
	const gameToStart = await Game.findByPk(gameId);
	gameToStart.hasStarted = true;
	const resBody = await gameToStart.save();
	return res.json(resBody);
});

// PUT end game
router.put("/:gameId/end", requireAuthentication, async (req, res, next) => {
	const { gameId } = req.params;
	const gameToEnd = await Game.findByPk(gameId, {
		include: [
			{
				model: Round,
				as: "gameRounds",
				include: {
					model: Drawing,
					as: "roundDrawings",
					include: [
						{
							model: DrawingVote,
							as: "votes"
						},
						{
							model: User,
							as: "artist"
						}
					]
				}
			},
			{ model: User, as: "creator" },
			{ model: User, as: "players" }
		]
	});
	gameToEnd.hasEnded = true;
	const resBody = await gameToEnd.save();
	return res.json(resBody);
});

module.exports = router;
