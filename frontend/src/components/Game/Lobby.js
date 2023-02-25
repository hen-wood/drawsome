import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { thunkLoadGame } from "../../store/games";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

import "./Lobby.css";

let socket;
export default function Lobby() {
	const dispatch = useDispatch();
	const history = useHistory();
	const user = useSelector(state => state.session.user);
	const game = useSelector(state => state.games.currentGame);
	const { gameCode } = useParams();
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		if (gameCode)
			dispatch(thunkLoadGame(gameCode)).then(() => {
				setIsLoaded(true);
			});
	}, [gameCode]);

	useEffect(() => {
		socket = io("http://localhost:4000");
		socket.on("connect", () => {
			console.log("Connected to socket.io server");
		});

		socket.on("disconnect", () => {
			console.log("Disconnected from socket.io server");
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<div id="lobby-container">
			<h1>Hello From Lobby! 👑</h1>
		</div>
	);
}
