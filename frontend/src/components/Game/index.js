import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { SocketContext } from "../../context/Socket";
import GameLobby from "./GameLobby";
import GameVote from "./GameVote";
import GameRound from "./GameRound";
import GameLeaderboard from "./GameLeaderboard";
import "./Game.css";
import loadingGif from "../../images/loading.gif";
import useSocketListeners from "./utils";

export default function Game() {
	const gameState = useSelector(state => state.gameState);
	useSocketListeners(gameState);

	// useEffect(() => {
	// 	const isHost = game.creatorId;
	// 	socket.on("connect", () => {
	// 		dispatch(actionConnectPlayer(socket.id, user));
	// 		utils.emitClientConnected(user, socket, game.code);
	// 	});

	// 	socket.on("player-connected", (user, socketId) => {
	// 		dispatch(actionConnectPlayer(socketId, user));
	// 		if (isHost) {
	// 			utils.emitHostGameState(
	// 				{ game, players, currentRound, section },
	// 				socketId,
	// 				socket
	// 			);
	// 		}
	// 	});

	// 	socket.on("game-state-from-host", gameState => {
	// 		dispatch(actionSyncWithHost(gameState));
	// 	});

	// 	socket.on("data for new player", hostDataStr => {});

	// 	socket.on("host started game", () => {});

	// 	socket.on("server sending drawing", drawingData => {});

	// 	socket.on("start vote", hostGameStateStr => {});

	// 	socket.on("server sending vote", playerVotedFor => {});

	// 	socket.on("start leaderboard", hostDataStr => {});

	// 	socket.on("post-round data", hostDataStr => {});

	// 	socket.on("game over", hostDataStr => {});

	// 	return () => {
	// 		socket.disconnect();
	// 	};
	// }, []);

	return (
		<div id="game-container">
			{gameState.section === "lobby" ? (
				<GameLobby />
			) : gameState.section === "round" ? (
				<GameRound />
			) : gameState.section === "vote" ? (
				<GameVote />
			) : gameState.section === "leaderboard" ? (
				<GameLeaderboard />
			) : (
				<img src={loadingGif} alt="loading" />
			)}
		</div>
	);
}
