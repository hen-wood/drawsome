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
const io = socketIo(server, {
	cors: {
		origin: "*"
	}
}); // initialize socket.io and pass in the http server

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
		message: err.message,
		statusCode: err.status,
		errors: err.errors,
		stack: isProduction ? null : err.stack
	});
});

// socket.io stuff

io.on("connection", socket => {
	socket.on("client-connected", (user, socketId, gameCode) => {
		socket.join(gameCode);
		socket.to(gameCode).emit("player-connected", user, socketId);
	});

	socket.on("sync-host-one-player", (gameState, socketId) => {
		io.to(socketId).emit("game-state-from-host", gameState);
	});

	socket.on("sync-host-all-players", (gameState, gameCode) => {
		io.to(gameCode).emit("game-state-from-host", gameState);
	});

	socket.on("host-started-vote", (drawings, gameCode) => {
		io.to(gameCode).emit("start-vote", drawings);
	});

	socket.on("host-started-round", (roundIdx, gameCode) => {
		io.to(gameCode).emit("start-round", roundIdx);
	});

	socket.on("host-started-round-winner", (votes, gameCode) => {
		io.to(gameCode).emit("start-round-winner", votes);
	});

	socket.on("player-sent-drawing", (drawingData, hostSocket) => {
		io.to(hostSocket).emit("player-drawing-to-host", drawingData);
	});
	socket.on("player-sent-vote", (playerVotedFor, hostSocket) => {
		io.to(hostSocket).emit("player-vote-to-host", playerVotedFor);
	});

	socket.on("disconnecting", reason => {
		for (let room of socket.rooms) {
			if (room !== socket.id) {
				socket.to(room).emit("player-disconnected", socket.id);
			}
		}
	});
});

module.exports = { app, server };
