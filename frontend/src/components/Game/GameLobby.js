import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { actionStartGame } from "../../store/games";
import "./Game.css";
export default function GameLobby({ socket }) {
	const dispatch = useDispatch();
	const user = useSelector(state => state.session.user);
	const game = useSelector(state => state.games.currentGame);
	const currentPlayers = useSelector(state => state.games.currentPlayers);
	const [connectedPlayers, setConnectedPlayers] = useState({});
	const [playerCount, setPlayerCount] = useState(0);
	const { gameCode } = useParams();

	useEffect(() => {
		setConnectedPlayers(currentPlayers);
		setPlayerCount(Object.keys(currentPlayers).length);
	}, [currentPlayers, gameCode]);

	const waitingMessage = (count, limit) => {
		const numRemaining = limit - count;
		const gameFull = limit - count === 0;
		const isCreator = user.id === game.creator.id;
		const message = `Waiting for ${
			gameFull && isCreator
				? "you to start the game"
				: gameFull
				? game.creator.username + " to start the game"
				: numRemaining + " more players to join the game"
		}...`;

		return <p>{message}</p>;
	};

	const copyCode = code => {
		navigator.clipboard.writeText(code);
	};

	const startGame = () => {
		dispatch(actionStartGame());
		socket.emit("creator started game", gameCode);
	};

	return (
		game && (
			<div id="lobby-container">
				<h1>Let's play Drawsome! 🧑‍🎨</h1>
				<p id="copy-code" onClick={() => copyCode(gameCode)}>
					copy game code: {gameCode} 🔗
				</p>
				<div className="divider"></div>
				{waitingMessage(playerCount, game.numPlayers)}
				{Object.keys(connectedPlayers).map(key => {
					const player = connectedPlayers[key];
					const isCreator = player.user.id === game.creator.id;
					return (
						<p className="lobby-player" key={key}>
							{`${isCreator ? "👑" : "✅"} ${
								isCreator && user.id === game.creator.id
									? "You"
									: user.id === player.user.id
									? "You"
									: player.user.username
							} ${isCreator ? "created the game" : "joined the game"}`}
						</p>
					);
				})}
				{playerCount >= 2 && user.id === game.creator.id && (
					<button onClick={startGame}>Start the game!</button>
				)}
			</div>
		)
	);
}
