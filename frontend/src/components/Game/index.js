import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkLoadGame } from "../../store/games";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

import "./Game.css";
import GameLobby from "./GameLobby";
import GameRound from "./GameRound";

let socket;
export default function Game() {
	const dispatch = useDispatch();
	const history = useHistory();
	const user = useSelector(state => state.session.user);
	const game = useSelector(state => state.games.currentGame);

	const { gameCode } = useParams();
	const [isLoaded, setIsLoaded] = useState(false);
	const [socketState, setSocketState] = useState(null);
	const [connectedPlayers, setConnectedPlayers] = useState({});
	const [exitSocketId, setExitSocketId] = useState(null);
	const [playerCount, setPlayerCount] = useState(0);
	const [gameStarted, setGameStarted] = useState(false);
	const [roundNumber, setRoundNumber] = useState(1);

	useEffect(() => {
		if (gameCode)
			dispatch(thunkLoadGame(gameCode)).then(() => {
				setIsLoaded(true);
			});
	}, []);

	useEffect(() => {
		socket = io();
		if (isLoaded) {
			socket.on("connect", () => {
				setSocketState(socket);
				const newPlayer = {
					user,
					gameCode,
					socketId: socket.id
				};
				setConnectedPlayers({
					[user.id]: newPlayer
				});
				socket.emit("joined", newPlayer);
			});

			socket.on("new player broadcast", newPlayer => {
				const newPlayerId = newPlayer.user.id;
				setConnectedPlayers(prev => ({ ...prev, [newPlayerId]: newPlayer }));
				if (newPlayerId !== user.id) {
					socket.emit("current connected player data", {
						currentUser: user,
						gameCode,
						newPlayerId,
						socketId: socket.id
					});
				}
			});

			socket.on("broadcast for new player", data => {
				const { currentUser, gameCode, newPlayerId, socketId } = data;
				if (user.id === newPlayerId) {
					setConnectedPlayers(prev => ({
						...prev,
						[currentUser.id]: { user: currentUser, gameCode, socketId }
					}));
				}
			});

			socket.on("broadcast creator started game", () => {
				dispatch(thunkLoadGame(gameCode)).then(() => {
					setGameStarted(true);
				});
			});

			socket.on("times up broadcast", roundEndNumber => {
				setRoundNumber(roundEndNumber + 1);
			});

			socket.on("player leaving", socketId => {
				setExitSocketId(socketId);
			});
		}

		return () => {
			socket.disconnect();
		};
	}, [isLoaded]);

	useEffect(() => {
		if (exitSocketId) {
			const exitPlayerId = Object.keys(connectedPlayers).find(
				key => connectedPlayers[key].socketId === exitSocketId
			);
			if (exitPlayerId) {
				const updatedPlayers = { ...connectedPlayers };
				delete updatedPlayers[exitSocketId];
				setConnectedPlayers({ ...updatedPlayers });
			}
		}
	}, [exitSocketId]);

	useEffect(() => {
		setPlayerCount(Object.keys(connectedPlayers).length);
	}, [connectedPlayers]);

	return isLoaded && socketState ? (
		<div id="game-container">
			{gameStarted ? (
				<GameRound
					game={game}
					socket={socketState}
					roundNumber={roundNumber}
					gameCode={gameCode}
				/>
			) : (
				<GameLobby
					user={user}
					game={game}
					connectedPlayers={connectedPlayers}
					playerCount={playerCount}
					socket={socketState}
					exitSocketId={exitSocketId}
				/>
			)}
		</div>
	) : (
		<div id="game-container">
			<p>Loading...</p>
		</div>
	);
}
