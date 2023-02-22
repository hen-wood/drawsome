// backend/routes/api/session.js
const express = require("express");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { validateLogin } = require("../../utils/validation-chains");
const { User } = require("../../db/models");

const router = express.Router();

// Log in
router.post("/", validateLogin, async (req, res, next) => {
	const { credential, password } = req.body;

	const user = await User.login({ credential, password });

	if (!user) {
		const err = new Error("Account not found");
		err.status = 401;
		return next(err);
	}

	await setTokenCookie(res, user);
	const resBody = {
		id: user.id,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		username: user.username
	};
	return res.json({
		user: resBody
	});
});

// Log out
router.delete("/", (_req, res) => {
	res.clearCookie("token");
	return res.json({ message: "success" });
});

// Restore session user
router.get("/", restoreUser, (req, res) => {
	const { user } = req;
	if (user) {
		return res.json({
			user: user.toSafeObject()
		});
	} else return res.json({ user: null });
});

module.exports = router;
