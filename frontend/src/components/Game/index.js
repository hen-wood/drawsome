import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

import "./Game.css";
let socket;
export default function Game() {
	const dispatch = useDispatch();
	const user = useSelector(state => state.session.user);
	const game = useSelector(state => state.games.currentGame);

	const [gameState, setGameState] = useState({ players: {} });
	const [gameReady, setGameReady] = useState(false);

	useEffect(() => {
		socket = io();
		socket.on("connect", () => {
			// New player emits their data to the server
			socket.emit("join", {
				player: { ...user, socketId: socket.id },
				roomId: game.code
			});
		});
		socket.on("new player joined", newPlayer => {
			// All players will update their gameState with the new players info (including the newPlayer)
			setGameState(prevGameState => {
				return {
					...prevGameState,
					players: {
						...prevGameState.players,
						[newPlayer.id]: { ...newPlayer }
					}
				};
			});
			// All current users emit event to send current gameState to the new player in a direct message
			const currentPlayer = { ...user, socketId: socket.id };

			socket.emit("sync new player with current players", {
				currentPlayer,
				newPlayerSocketId: newPlayer.socketId
			});
		});

		socket.on("sync new player", currentPlayer => {
			// New client receives current player information from all of the current players
			setGameState(prevGameState => ({
				...prevGameState,
				players: {
					...prevGameState.players,
					[currentPlayer.id]: { ...currentPlayer }
				}
			}));
		});

		socket.on("player disconnected", playerId => {
			setGameState(prevGameState => {
				const updatedGameState = { ...prevGameState };
				delete updatedGameState.players[playerId];
				return updatedGameState;
			});
		});

		return () => {
			socket.emit("disconnection", { roomId: game.code, playerId: user.id });
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		console.log(`${user.username} gameState updated`, gameState);
		if (Object.keys(gameState.players).length === game.numPlayers) {
			setGameReady(true);
		}
	}, [gameState, game]);

	return (
		<div id="game-container">
			{gameReady ? <h1>Game is ready</h1> : <h1>{game.code}</h1>}
		</div>
	);
}
