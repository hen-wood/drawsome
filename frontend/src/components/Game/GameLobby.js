import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { actionStartGame, thunkStartGame } from "../../store/games";
import "./Game.css";
export default function GameLobby({
	user,
	game,
	connectedPlayers,
	playerCount,
	socket,
	exitSocketId
}) {
	const dispatch = useDispatch();
	const { gameCode } = useParams();

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

	const startGame = (gameCode, gameId, socket) => {
		dispatch(thunkStartGame(gameId))
			.then(startedGame => {
				socket.emit("creator started game", gameCode);
			})
			.catch(async res => {
				const error = await res.json();
			});
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
					const hasExited = player.socketId === exitSocketId;
					const isCreator = player.user.id === game.creator.id;
					if (hasExited) {
						return `${isCreator ? "👑" : "✅"} ${
							isCreator && user.id === game.creator.id
								? "You"
								: user.id === player.user.id
								? "You"
								: player.user.username
						} has disconnected...`;
					} else {
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
					}
				})}
				{playerCount >= 2 && user.id === game.creator.id && (
					<button onClick={() => startGame(game.code, game.id, socket)}>
						Start the game!
					</button>
				)}
			</div>
		)
	);
}
