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

	socket.on("host-sent-game-state", (gameState, socketId) => {
		io.to(socketId).emit("game-state-from-host", gameState);
	});

	socket.on("host-started-game", gameCode => {
		io.to(gameCode).emit("start-game");
	});

	socket.on("host-sent-unpause", (gameState, gameCode) => {
		io.to(gameCode).emit("unpause-game", gameState);
	});
	// socket.on("join", newPlayerData => {
	// 	// Server receives 'joined' event from new player
	// 	const { roomId, player, isHost } = newPlayerData;
	// 	// roomId is destructured and socket is joined to the room associated with the gameCode
	// 	socket.join(roomId);
	// 	const roomData = socket.adapter.rooms.get(roomId);
	// 	if (isHost) roomData.hostId = player.id;
	// 	// server emits an event to the room with the new player's information
	// 	socket.to(roomId).emit("new player joined", player);
	// });

	// socket.on("data to new player", ({ hostDataStr, toSocketId }) => {
	// 	io.to(toSocketId).emit("data for new player", hostDataStr);
	// });

	// socket.on("start game", data => {
	// 	const { roomId } = data;
	// 	io.to(roomId).emit("host started game");
	// });

	// socket.on("submitted drawing to host", ({ drawingData, hostSocket }) => {
	// 	io.to(hostSocket).emit("server sending drawing", drawingData);
	// });

	// socket.on("all drawings received", ({ hostGameStateStr, roomId }) => {
	// 	io.to(roomId).emit("start vote", hostGameStateStr);
	// });

	// socket.on("player submitted vote", ({ playerVotedFor, hostSocket }) => {
	// 	io.to(hostSocket).emit("server sending vote", playerVotedFor);
	// });

	// socket.on("all votes received", ({ hostDataStr, roomId }) => {
	// 	io.to(roomId).emit("start leaderboard", hostDataStr);
	// });

	// socket.on("host data after round", ({ hostDataStr, roomId }) => {
	// 	io.to(roomId).emit("post-round data", hostDataStr);
	// });

	// socket.on("host game results", ({ hostDataStr, roomId }) => {
	// 	io.to(roomId).emit("game over", hostDataStr);
	// });

	// socket.on("client-disconnected", (gameCode, userId) => {
	// 	socket.to(gameCode).emit("player-disconnected", userId);
	// });

	// // socket.on("disconnect", reason => {
	// // 	console.log("disconnect reason", reason);
	// // });

	socket.on("disconnecting", reason => {
		for (let room of socket.rooms) {
			if (room !== socket.id) {
				socket.to(room).emit("player-disconnected", socket.id);
			}
		}
	});
});

module.exports = { app, server };
