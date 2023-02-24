// backend/routes/api/index.js
const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const drawingsRouter = require("./drawings.js");
const gamesRouter = require("./games.js");

// GET /api/set-token-cookie
const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);

router.use("/session", sessionRouter);

router.use("/users", usersRouter);

router.use("/drawings", drawingsRouter);

router.use("/games", gamesRouter);

router.post("/test", (req, res) => {
	res.json({ requestBody: req.body });
});

module.exports = router;
