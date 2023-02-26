const crypto = require("crypto");

function codeGen(number) {
	const acceptedLetters =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const acceptedNumbers = "1234567890";

	const hash = crypto.createHash("sha256").update(number.toString()).digest();
	const code = hash.toString("base64");
	let res = "";
	let i = 0;
	while (res.length < 5) {
		const char = code[i];
		if (acceptedLetters.includes(char)) {
			res = res + char.toUpperCase();
			i++;
		} else if (acceptedNumbers.includes(char)) {
			res = res + char;
			i++;
		} else {
			i++;
		}
	}
	return res;
}

module.exports = {
	codeGen
};
