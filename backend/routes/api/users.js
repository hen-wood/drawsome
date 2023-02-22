// backend/routes/api/users.js
const express = require("express");

const { setTokenCookie, checkIfUserExists } = require("../../utils/auth");
const { validateSignup } = require("../../utils/validation-chains");
const { User } = require("../../db/models");
const { token } = require("morgan");

const router = express.Router();

// Sign up
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
		token: req.cookies.token
	};
	return res.json(resBody);
});

module.exports = router;
