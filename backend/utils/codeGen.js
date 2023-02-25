const crypto = require("crypto");

function codeGen(number) {
	const hash = crypto.createHash("sha256").update(number.toString()).digest();
	const code = hash.toString("base64").slice(0, 5);
	return code;
}

module.exports = {
	codeGen
};
