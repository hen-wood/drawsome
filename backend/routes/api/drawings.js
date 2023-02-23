// backend/routes/api/users.js
const express = require("express");
const { singleMulterUpload, uploadDrawingToS3 } = require("../../awsS3.js");
const { requireAuthentication } = require("../../utils/auth");
const { Drawing } = require("../../db/models");

const router = express.Router();

// POST new drawing
router.post(
	"/",
	requireAuthentication,
	singleMulterUpload("image"),
	async (req, res, next) => {
		const dataURL = req.body.image;
		const title = req.body.title;
		const userId = req.user.id;

		const drawingUrl = await uploadDrawingToS3(dataURL);

		const newDrawing = await Drawing.create({
			userId,
			title,
			drawingUrl
		});

		return res.json(newDrawing);
	}
);

module.exports = router;
