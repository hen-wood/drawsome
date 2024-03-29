// backend/routes/api/drawings.js
const express = require("express");
const { singleMulterUpload, uploadDrawingToS3 } = require("../../awsS3.js");
const { requireAuthentication } = require("../../utils/auth");
const { Drawing, DrawingVote } = require("../../db/models");

const router = express.Router();

// POST new drawing
router.post(
	"/",
	requireAuthentication,
	singleMulterUpload("image"),
	async (req, res, next) => {
		const { image, title, roundId } = req.body;
		const userId = req.user.id;

		const drawingUrl = await uploadDrawingToS3(image);

		const newDrawing = await Drawing.create({
			userId,
			roundId,
			title,
			drawingUrl
		});
		return res.json(newDrawing);
	}
);

// POST drawing vote
router.post(
	"/:drawingId/vote",
	requireAuthentication,
	async (req, res, next) => {
		const { drawingId } = req.params;
		const { votedForId, gameId } = req.body;

		const newVote = await DrawingVote.create({ drawingId, votedForId, gameId });
		return res.json(newVote);
	}
);

// PUT edit drawing title
router.put(
	"/:drawingId/edit",
	requireAuthentication,
	async (req, res, next) => {
		const { drawingId } = req.params;
		const { newTitle } = req.body;
		const drawingToEdit = await Drawing.findByPk(+drawingId);

		drawingToEdit.title = newTitle;
		await drawingToEdit.save();
		return res.json(drawingToEdit);
	}
);

// DELETE delete drawing
router.delete(
	"/:drawingId/delete",
	requireAuthentication,
	async (req, res, next) => {
		const { drawingId } = req.params;
		const drawingToDelete = await Drawing.findByPk(+drawingId);

		await drawingToDelete.destroy();
		return res.json({ message: `Deleted drawing #${drawingId}` });
	}
);

module.exports = router;
