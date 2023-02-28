import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../context/Socket";
import { GameStateContext } from "../../context/GameState";
import GameEnd from "./GameEnd";
import GameLobby from "./GameLobby";
import GameVote from "./GameVote";
import GameRound from "./GameRound";
import "./Game.css";

export default function Game() {
	const { players, setPlayers, gameSection, setPlayerCount, setGameSection } =
		useContext(GameStateContext);
	const user = useSelector(state => state.session.user);
	const game = useSelector(state => state.games.currentGame);
	const socket = useContext(SocketContext);

	useEffect(() => {
		socket.on("connect", () => {
			// New player emits their data to the server
			socket.emit("join", {
				player: { ...user, socketId: socket.id },
				roomId: game.code
			});
		});

		socket.on("new player joined", newPlayer => {
			// All players will update their gameState with the new players info (including the newPlayer)
			setPlayerCount(prev => prev + 1);
			setPlayers(prevPlayers => {
				return {
					...prevPlayers,
					[newPlayer.id]: { ...newPlayer, score: 0 }
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
			setPlayerCount(prev => prev + 1);
			setPlayers(prevPlayers => ({
				...prevPlayers,
				[currentPlayer.id]: { ...currentPlayer, score: 0 }
			}));
		});

		socket.on("player disconnected", playerId => {
			setPlayerCount(prev => prev - 1);
			setPlayers(prevPlayers => {
				const updatedPlayers = { ...prevPlayers };
				delete prevPlayers[playerId];
				return updatedPlayers;
			});
		});

		// All players start
		socket.on("host started round", () => {
			setGameSection("round");
		});

		socket.on("host disconnected", () => {
			socket.disconnect();
		});

		return () => {
			setPlayerCount(prev => prev - 1);
			socket.emit("disconnection", {
				roomId: game.code,
				playerId: user.id,
				isHost: game.creatorId === user.id
			});
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		console.log(`${user.username} gameState updated`, { players });
	}, [players]);

	return (
		<div id="game-container">
			{gameSection === "lobby" ? (
				<GameLobby />
			) : gameSection === "round" ? (
				<GameRound />
			) : gameSection === "vote" ? (
				<GameVote />
			) : (
				<GameEnd />
			)}
		</div>
	);
}
