import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/Socket";
import {
	actionAddPlayer,
	actionDisconnectPlayer,
	actionReconnectPlayer,
	actionSetCurrentRound,
	actionSetScores,
	actionSetGameSection,
	actionAddGameDrawing,
	actionSetPlayerVotedFor,
	actionAddPoints,
	actionResetGame
} from "../../store/games";
import GameEnd from "./GameEnd";
import GameLobby from "./GameLobby";
import GameVote from "./GameVote";
import GameRound from "./GameRound";
import GameLeaderboard from "./GameLeaderboard";
import "./Game.css";

export default function Game() {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const history = useHistory();
	const user = useSelector(state => state.session.user);
	const game = useSelector(state => state.game);

	useEffect(() => {
		socket.on("connect", () => {
			// New player emits their data to the server
			socket.emit("join", {
				player: { ...user, socketId: socket.id, connected: true },
				roomId: game.code
			});
		});

		socket.on("new player joined", newPlayer => {
			// If a player does not have the newPlayer in their game state...
			if (!game.players[newPlayer.id]) {
				// All players will update their gameState with the new players info (including the newPlayer)
				dispatch(actionAddPlayer(newPlayer));
			} else {
				// Otherwise, they will update the existing player's 'connected' property to be true
				dispatch(actionReconnectPlayer(newPlayer.id));
			}
			// All current users emit event to send current gameState to the new player in a direct message
			const currentPlayer = { ...user, socketId: socket.id, connected: true };

			socket.emit("sync new player with current players", {
				currentPlayer,
				newPlayerSocketId: newPlayer.socketId
			});
		});

		socket.on("sync new player", currentPlayer => {
			// New player receives current player information from all of the current players
			dispatch(actionAddPlayer(currentPlayer));
		});

		socket.on("player disconnected", playerId => {
			// Players will update the player's 'connected' property to be false
			dispatch(actionDisconnectPlayer(playerId));
		});

		// All players start Round 1
		socket.on("host started game", () => {
			dispatch(actionSetCurrentRound(1));
			dispatch(actionSetGameSection("round"));
		});

		socket.on("server received drawing", drawingData => {
			if (drawingData.userId !== user.id) {
				dispatch(actionSetPlayerVotedFor(drawingData.userId));
			}
			dispatch(actionAddGameDrawing(drawingData));
		});

		socket.on("server received vote", playerVotedFor => {
			dispatch(actionAddPoints(playerVotedFor));
		});

		socket.on("host disconnected", () => {
			socket.disconnect();
			history.push("/join-game");
			dispatch(actionResetGame());
		});

		return () => {
			socket.emit("disconnection", {
				roomId: game.code,
				playerId: user.id,
				isHost: game.creatorId === user.id
			});
			socket.disconnect();
			dispatch(actionResetGame());
		};
	}, []);

	return (
		<div id="game-container">
			{game.section === "lobby" ? (
				<GameLobby />
			) : game.section === "round" ? (
				<GameRound />
			) : game.section === "vote" ? (
				<GameVote />
			) : game.section === "leaderboard" ? (
				<GameLeaderboard />
			) : (
				<GameEnd />
			)}
		</div>
	);
}
