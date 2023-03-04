import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/Socket";
import GameEnd from "./GameEnd";
import GameLobby from "./GameLobby";
import GameVote from "./GameVote";
import GameRound from "./GameRound";
import GameLeaderboard from "./GameLeaderboard";
import "./Game.css";
import {
	getLocalAsObj,
	getLocalAsStr,
	setLocalFromObj,
	setLocalFromStr,
	updateLocalSection,
	updateLocalDrawings,
	updateLocalVote
} from "./utils/localFunctions";

export default function Game() {
	const socket = useContext(SocketContext);
	const user = useSelector(state => state.session.user);
	const [gameState, setGameState] = useState(getLocalAsObj("gameState"));
	const { code, creatorId } = gameState;

	useEffect(() => {
		const isHost = creatorId === user.id;
		socket.on("connect", () => {
			const gameSettings = getLocalAsObj("gameState");
			const player = { ...user, socketId: socket.id, connected: true };
			if (isHost) {
				const initState = setLocalFromObj("gameState", {
					...gameSettings,
					players: { [player.id]: player },
					scores: { [player.id]: 0 },
					currentRound: gameSettings.gameRounds[0],
					section: "lobby",
					drawings: {},
					playerVotedFor: null,
					votes: { [player.id]: 0 },
					voteCount: 0,
					hostSocket: socket.id
				});
				setGameState(initState);
			}
			socket.emit("join", {
				player,
				roomId: code,
				isHost
			});
		});

		socket.on("new player joined", player => {
			const currentState = getLocalAsObj("gameState");
			const newState = setLocalFromObj("gameState", {
				...currentState,
				players: { ...currentState.players, [player.id]: player },
				scores: { ...currentState.scores, [player.id]: 0 },
				votes: { ...currentState.votes, [player.id]: 0 }
			});
			setGameState(prev => ({ ...prev, ...newState }));

			if (isHost) {
				const hostDataStr = getLocalAsStr("gameState");
				const toSocketId = player.socketId;
				socket.emit("data to new player", { hostDataStr, toSocketId });
			}
		});

		socket.on("data for new player", hostDataStr => {
			const hostState = setLocalFromStr("gameState", hostDataStr);
			setGameState(hostState);
		});

		socket.on("host started game", () => {
			// const otherId = Object.
			const newState = updateLocalSection("round");
			setGameState(prev => ({ ...prev, section: newState.section }));
		});

		socket.on("server sending drawing", drawingData => {
			const { roundId, userId } = drawingData;
			const updatedState = updateLocalDrawings(roundId, userId, drawingData);
			setGameState(prev => ({
				...prev.drawings,
				[roundId]: updatedState.drawings[roundId]
			}));
			const currPlayers = updatedState.players;
			const currDrawings = updatedState.drawings[roundId];
			if (
				Object.keys(currPlayers).length === Object.keys(currDrawings).length
			) {
				const hostGameStateStr = JSON.stringify(updatedState);
				socket.emit("all drawings received", {
					hostGameStateStr,
					roomId: code
				});
			}
		});

		socket.on("start vote", hostGameStateStr => {
			updateLocalSection("vote");
			if (!isHost) {
				const updatedState = setLocalFromStr("gameState", hostGameStateStr);
				const roundId = updatedState.currentRound.id;
				setGameState(prev => ({
					...prev,
					drawings: { ...prev.drawings, [roundId]: updatedState.drawings },
					section: "vote",
					votes: { [user.id]: 0 }
				}));
			} else {
				setGameState(prev => ({
					...prev,
					section: "vote",
					votes: { [user.id]: 0 }
				}));
			}
		});

		socket.on("server sending vote", playerVotedFor => {
			const updatedState = updateLocalVote(playerVotedFor);
			console.log({ updatedState });
			if (updatedState.voteCount === Object.keys(updatedState.players).length) {
				const hostDataStr = JSON.stringify(updatedState);
				socket.emit("all votes received", { hostDataStr, roomId: code });
			}
		});

		socket.on("start leaderboard", hostDataStr => {
			const updatedState = setLocalFromStr("gameState", hostDataStr);
			setGameState(prev => ({ ...updatedState, section: "leaderboard" }));
		});

		socket.on("server sending post-round data", hostDataStr => {
			const updatedState = setLocalFromStr("gameState", hostDataStr);
			setGameState(prev => ({ ...updatedState }));
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	return gameState ? (
		<div id="game-container">
			{gameState.section === "lobby" ? (
				<GameLobby gameState={gameState} setGameState={setGameState} />
			) : gameState.section === "round" ? (
				<GameRound gameState={gameState} setGameState={setGameState} />
			) : gameState.section === "vote" ? (
				<GameVote gameState={gameState} setGameState={setGameState} />
			) : gameState.section === "leaderboard" ? (
				<GameLeaderboard gameState={gameState} setGameState={setGameState} />
			) : gameState.section === "game end" ? (
				<GameEnd gameState={gameState} setGameState={setGameState} />
			) : (
				<h1>Loading game...</h1>
			)}
		</div>
	) : (
		<div id="game-container">
			<h1>Loading game...</h1>
		</div>
	);
}
