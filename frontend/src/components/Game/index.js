import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
	actionAddPlayer,
	actionExitGame,
	actionRemovePlayer,
	actionSetPlayers,
	thunkLoadGame
} from "../../store/games";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

import "./Game.css";
import Lobby from "./Lobby";

let socket;
export default function Game() {
	const dispatch = useDispatch();
	const history = useHistory();
	const user = useSelector(state => state.session.user);
	const game = useSelector(state => state.games.currentGame);
	const players = useSelector(state => state.games.currentPlayers);
	const { gameCode } = useParams();
	const [isLoaded, setIsLoaded] = useState(false);
	const [playerCount, setPlayerCount] = useState(0);

	useEffect(() => {
		if (gameCode)
			dispatch(thunkLoadGame(gameCode)).then(() => {
				setIsLoaded(true);
			});
	}, [gameCode]);

	useEffect(() => {
		socket = io();

		socket.on("connect", () => {
			if (gameCode) {
				socket.emit("joined", { user, gameCode });
			}
			socket.emit("request current players", {
				players,
				gameCode
			});
		});

		socket.on("player joined", player => {
			// add new player to state
			dispatch(actionAddPlayer(player));
			const updatedPlayers = { ...players, [player.user.id]: player };
			socket.emit("request current players", {
				players: updatedPlayers,
				gameCode
			});
		});

		socket.on("updating all players", updatedPlayers => {
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

		socket.on("player left", socketId => {
			// remove player from state
			setIsLoaded(false);
			dispatch(actionRemovePlayer(socketId));
			setIsLoaded(true);
		});

		return () => {
			socket.disconnect();
			dispatch(actionExitGame());
		};
	}, [gameCode]);

	return isLoaded ? (
		<div id="game-container">
			<Lobby />
		</div>
	) : (
		<div id="game-container">
			<p>Loading...</p>
		</div>
	);
}
