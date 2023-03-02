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
	socket.on("join", newPlayerData => {
		// Server receives 'joined' event from new player
		const { roomId, player } = newPlayerData;
		// roomId is destructured and socket is joined to the room associated with the gameCode
		socket.join(roomId);
		// server emits an event to the room with the new player's information
		io.to(roomId).emit("new player joined", player);
	});

	socket.on("sync new player with current players", currentPlayerData => {
		// 'sync new player with current players' to sync new player's gameState with the host's gameState
		const { currentPlayer, newPlayerSocketId } = currentPlayerData;
		// Server emits 'sync new player' events directly to the new client
		io.to(newPlayerSocketId).emit("sync new player", currentPlayer);
	});

	socket.on("start game", data => {
		const { roomId } = data;
		io.to(roomId).emit("host started game");
	});

	socket.on("player submitted drawing", data => {
		const { roomId, drawingData } = data;
		io.to(roomId).emit("server received drawing", drawingData);
	});

	socket.on("player submitted vote", data => {
		const { roomId, playerVotedFor } = data;
		io.to(roomId).emit("server received vote", playerVotedFor);
	});

	socket.on("disconnection", data => {
		const { roomId, playerId, isHost } = data;
		if (isHost) {
			console.log("host disconnected");
			socket.to(roomId).emit("host disconnected");
		} else {
			socket.to(roomId).emit("player disconnected", playerId);
		}
	});
});

module.exports = { app, server };
