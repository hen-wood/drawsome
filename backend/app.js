const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const { ValidationError } = require("sequelize");
const { environment } = require("./config");
const http = require("http"); // import Node's http module
const socketIo = require("socket.io"); // import socket.io

const isProduction = environment === "production";

const app = express();
const server = http.createServer(app); // create an http server using the Express app
const io = socketIo(server); // initialize socket.io and pass in the http server

app.use(morgan("dev"));

app.use(cookieParser());
app.use(express.json());

if (!isProduction) {
	// enable cors only in development
	app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
	helmet.crossOriginResourcePolicy({
		policy: "cross-origin"
	})
);

// Set the _csrf token and create req.csrfToken method
app.use(
	csurf({
		cookie: {
			secure: isProduction,
			sameSite: isProduction && "Lax",
			httpOnly: true
		}
	})
);

// add a socket.io middleware that logs incoming socket connections
io.use((socket, next) => {
	console.log(`Socket connected: ${socket.id}`);
	next();
});

app.use(routes); // Connect all the routes

app.use((_req, _res, next) => {
	const err = new Error("The requested resource couldn't be found.");
	err.title = "Resource Not Found";
	err.errors = ["The requested resource couldn't be found."];
	err.status = 404;
	next(err);
});

// check if error is a Sequelize error
app.use((err, _req, _res, next) => {
	if (err instanceof ValidationError) {
		const errObj = {};
		err.errors.forEach(err => {
			errObj[err.param] = err.msg;
		});
		err.errors = errObj;
		// err.title = "Validation error";
	}
	next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
	res.status(err.status || 500);
	console.error(err);
	return res.json({
		// title: err.title || "Server Error",
		message: err.message,
		statusCode: err.status,
		errors: err.errors,
		stack: isProduction ? null : err.stack
	});
});

// socket.io stuff

io.on("connect", socket => {
	socket.on("joined", newPlayer => {
		const { gameCode } = newPlayer;
		socket.join(gameCode);

		io.to(gameCode).emit("new player broadcast", newPlayer);
	});

	socket.on("current connected player data", data => {
		const { currentUser, gameCode, newPlayerId, socketId } = data;

		socket.join(gameCode);
		io.to(gameCode).emit("broadcast for new player", {
			currentUser,
			gameCode,
			newPlayerId,
			socketId
		});
	});

	socket.on("update for player leaving", data => {
		const { currentUser, gameCode, socketId } = data;
		socket.join(gameCode);
		io.to(gameCode).emit("broadcast player data for player leaving", {
			currentUser,
			gameCode,
			socketId
		});
	});

	socket.on("creator started game", gameCode => {
		socket.join(gameCode);
		io.to(gameCode).emit("broadcast creator started game");
	});

	socket.on("times up", data => {
		const { gameCode, roundNumber } = data;
		socket.join(gameCode);
		io.to(gameCode).emit("times up broadcast", roundNumber);
	});

	socket.on("disconnecting", () => {
		io.emit("player leaving", socket.id); // the Set contains at least the socket ID
	});
});

module.exports = { app, server };
