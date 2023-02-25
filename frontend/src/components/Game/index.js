import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { thunkLoadGame } from "../../store/games";
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
	const { gameCode } = useParams();
	const [isLoaded, setIsLoaded] = useState(false);
	const [connectedPlayers, setConnectedPlayers] = useState({});
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
			console.log("Connected to socket.io server");
			if (gameCode) {
				socket.emit("joined", { user, gamecode: gameCode });
			}
		});

		socket.on("disconnect", () => {
			console.log("Disconnected from socket.io server");
		});

		socket.on("all players", players => {
			console.log({ players });
			// update state with all players in game
			const updatedPlayers = {};
			players.forEach(player => {
				updatedPlayers[player.user.id] = player;
			});
			setPlayerCount(players.length);
			setConnectedPlayers(updatedPlayers);
		});

		socket.on("player joined", player => {
			// add new player to state
			setPlayerCount(prev => prev + 1);
			setConnectedPlayers(prev => ({ ...prev, [player.user.id]: player }));
		});

		socket.on("player left", player => {
			// remove player from state
			setPlayerCount(prev => prev - 1);
			const updatedPlayers = { ...connectedPlayers };
			if (connectedPlayers[player.user.id])
				delete connectedPlayers[player.user.id];
			setConnectedPlayers(updatedPlayers);
		});

		return () => {
			socket.disconnect();
		};
	}, [gameCode]);

	return isLoaded ? (
		<div id="game-container">
			<Lobby connectedPlayers={connectedPlayers} playerCount={playerCount} />
		</div>
	) : (
		<div id="game-container">
			<p>Loading...</p>
		</div>
	);
}
