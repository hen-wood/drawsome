import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
	actionAddPlayer,
	actionExitGame,
	actionRemovePlayer,
	actionSetPlayers,
	actionStartGame,
	thunkLoadGame,
	thunkStartGame
} from "../../store/games";
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
	const { currentGame: game, currentPlayers: players } = useSelector(
		state => state.games
	);

	const { gameCode } = useParams();
	const [isLoaded, setIsLoaded] = useState(false);
	const [gameStarted, setGameStarted] = useState(false);
	const [roundNumber, setRoundNumber] = useState(1);
	const [playerCount, setPlayerCount] = useState(0);
	const [socketState, setSocketState] = useState(null);

	useEffect(() => {
		if (gameCode)
			dispatch(thunkLoadGame(gameCode)).then(() => {
				setIsLoaded(true);
			});
	}, [gameCode]);

	useEffect(() => {
		socket = io();

		socket.on("connect", () => {
			setSocketState(socket);
			if (gameCode) {
				socket.emit("joined", { user, gameCode });
			}
			socket.emit("request current players", {
				players,
				gameCode
			});
		});

		return () => {
			socket.disconnect();
			dispatch(actionExitGame());
		};
	}, []);

	useEffect(() => {
		if (!socketState) return;

		socketState.on("player joined", player => {
			// add new player to state
			dispatch(actionAddPlayer(player));
			const updatedPlayers = { ...players, [player.user.id]: player };
			socket.emit("request current players", {
				players: updatedPlayers,
				gameCode
			});
		});

		socketState.on("updating all players", updatedPlayers => {
			if (Object.keys(updatedPlayers).length) {
				dispatch(actionSetPlayers(updatedPlayers));
			} else {
				socket.emit("request current players", {
					players: updatedPlayers,
					gameCode
				});
			}
			// socket.emit();
		});

		socketState.on("player left", socketId => {
			// remove player from state
			setIsLoaded(false);
			dispatch(actionRemovePlayer(socketId));
			setIsLoaded(true);
		});

		socketState.on("game has started", () => {
			dispatch(thunkStartGame()).then(() => {
				setGameStarted(true);
			});
		});

		if (game && game.hasStarted) {
			socketState.emit("creator started game", gameCode);
		}
	}, [socketState]);

	return isLoaded && socketState ? (
		<div id="game-container">
			{!gameStarted ? (
				<GameLobby socket={socketState} />
			) : (
				<GameRound roundNumber={roundNumber} />
			)}
		</div>
	) : (
		<div id="game-container">
			<p>Loading...</p>
		</div>
	);
}
