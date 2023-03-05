const express = require("express");
const { requireAuthentication } = require("../../utils/auth");
const { Player } = require("../../db/models");
const router = express.Router();

// PUT set final score
router.put("/:userId/score", requireAuthentication, async (req, res, next) => {
	const { userId } = req.params;
	const playerToEdit = await Player.findOne({ where: { userId } });
	if (!playerToEdit.finalScore) {
		playerToEdit.finalScore = 100;
	} else {
		playerToEdit.finalScore += 100;
	}
	await playerToEdit.save();
	return res.json({ message: "Set players score" });
});

module.exports = router;
