// backend/routes/api/users.js
const express = require("express");

const {
	setTokenCookie,
	checkIfUserExists,
	requireAuthentication
} = require("../../utils/auth");
const { validateSignup } = require("../../utils/validation-chains");
const { User, Drawing } = require("../../db/models");
const { token } = require("morgan");

const router = express.Router();

// GET - Get all drawings for a single user
router.get(
	"/:userId/drawings",
	requireAuthentication,
	async (req, res, next) => {
		const { userId } = req.params;
		// const drawings = await Drawing.findAll({
		// 	where: { userId }
		// });
		const drawings = await Drawing.scope(["roundDrawings"]).findAll({
			where: {
				userId
			}
		});
		return res.json(drawings);
	}
);

// POST - Sign up
router.post("/", checkIfUserExists, validateSignup, async (req, res, next) => {
	const { email, password, username } = req.body;
	const user = await User.signup({
		email,
		username,
		password
	});

	await setTokenCookie(res, user);
	const resBody = {
		id: user.id,
		email: user.email,
		username: user.username,
		token: req.cookies.token
	};
	return res.json(resBody);
});

module.exports = router;
