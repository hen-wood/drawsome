import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

import "./Game.css";
let socket;
export default function Game() {
	const user = useSelector(state => state.session.user);
	const game = useSelector(state => state.games.currentGame);

	const [gameState, setGameState] = useState({});

	useEffect(() => {
		socket = io();
		const isHost = game.creatorId === user.id;
		const player = { user, gameCode: game.code, socketId: socket.id, isHost };
		socket.on("connect", () => {
			setGameState({ players: { [user.id]: player } });
			socket.emit("joined", player);
		});
		socket.on("new player joined", newPlayer => {
			// All players will update their gameState with the new players info
			setGameState(prevGameState => ({
				...prevGameState,
				players: {
					...prevGameState.players,
					[newPlayer.user.id]: { ...newPlayer }
				}
			}));
			socket.emit("update from all players", player);
		});
		socket.on("sync new player", hostGameState => {
			console.log({ hostGameState });
			// New client receives updated gameState directly
			setGameState(hostGameState);
		});
	}, [game, user]);
	useEffect(() => {
		console.log({ name: user.username, gameState });
	}, [gameState]);

	return (
		<div id="game-container">{console.log("IN THE DOM", { gameState })}</div>
	);
}
