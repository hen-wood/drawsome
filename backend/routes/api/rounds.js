// backend/routes/api/rounds.js
const express = require("express");
const { requireAuthentication } = require("../../utils/auth");
const { Drawing, Game, Round, User } = require("../../db/models");
const { Op } = require("sequelize");

const router = express.Router();

// GET all drawings for a single round
// router.get('/:roundId/drawings', requireAuthentication, async (req, res, next) => {
//     const drawings
// })

module.exports = router;
