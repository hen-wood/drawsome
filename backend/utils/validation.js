// backend/utils/validation.js
const { validationResult } = require("express-validator");
const { ValidationError } = require("sequelize");

// middleware for formatting errors from express-validator middleware
const handleValidationErrors = (req, _res, next) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		const errors = validationErrors.array();

		const err = new ValidationError("Validation error");
		err.errors = errors;
		err.status = 400;
		next(err);
	}
	next();
};

module.exports = {
	handleValidationErrors
};
