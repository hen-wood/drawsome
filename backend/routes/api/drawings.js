// backend/routes/api/users.js
const express = require("express");
const { singleMulterUpload, uploadDrawingToS3 } = require("../../awsS3.js");

const { Drawing } = require("../../db/models");

const router = express.Router();

// POST new drawing
router.post("/", singleMulterUpload("image"), async (req, res, next) => {
	const dataURL = req.body.image;

	const drawingUrl = await uploadDrawingToS3(dataURL);

	const newDrawing = await Drawing.create({ userId: 1, drawingUrl });

	return res.json(newDrawing);
});

module.exports = router;
