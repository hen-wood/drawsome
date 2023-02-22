const { check } = require("express-validator");
const { handleValidationErrors } = require("./validation");

const validateSignup = [
	check("email")
		.exists({ checkFalsy: true })
		.isEmail()
		.withMessage("Email must be a valid format"),
	check("username")
		.exists({ checkFalsy: true })
		.isLength({ min: 4, max: 15 })
		.withMessage("Username must be 4-15 characters long"),
	check("username").not().isEmail().withMessage("Username cannot be an email."),
	check("password")
		.exists({ checkFalsy: true })
		.isLength({ min: 8, max: 15 })
		.withMessage("Password must be 8-15 characters long"),
	handleValidationErrors
];

const validateLogin = [
	check("password")
		.exists({ checkFalsy: true })
		.withMessage("Please provide a password."),
	handleValidationErrors
];

module.exports = {
	validateSignup,
	validateLogin
};
