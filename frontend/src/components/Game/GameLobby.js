import { useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkStartGame } from "../../store/games";
import { GameStateContext } from "../../context/GameState";
import { SocketContext } from "../../context/Socket";
import { startGame, copyCode, waitingMessage } from "./utils/lobbyTools";
import "./Game.css";

export default function GameLobby() {
	const dispatch = useDispatch();
	const { players, playerCount } = useContext(GameStateContext);
	const socket = useContext(SocketContext);
	const game = useSelector(state => state.games.currentGame);
	const user = useSelector(state => state.session.user);
	const playerKeys = Object.keys(players);

	return game && user ? (
		<div id="lobby-container">
			<h1>Let's play Drawsome! 🧑‍🎨</h1>
			<p id="copy-code" onClick={() => copyCode(game.code)}>
				copy game code: {game.code} 🔗
			</p>
			<div className="divider"></div>
			{waitingMessage(playerCount, game.numPlayers, user.id, game.creatorId)}
			{playerKeys.map(key => {
				const player = players[key];
				const isCreator = player.id === game.creatorId;

				return (
					<p className="lobby-player" key={key}>
						{`${isCreator ? "👑" : "✅"} ${
							isCreator && user.id === game.creatorId
								? "You"
								: user.id === player.id
								? "You"
								: player.username
						} ${isCreator ? "created the game" : "joined the game"}`}
					</p>
				);
			})}
			{playerCount >= 2 && user.id === game.creatorId && (
				<button
					onClick={
						() =>
							// startGame(
							// 	game.code,
							// 	game.id,
							// 	socket,
							// 	thunkStartGame,
							// 	dispatch
							// ).then(() => {

							socket.emit("start round", { roomId: game.code })

						// })
					}
				>
					Start the game!
				</button>
			)}
		</div>
	) : (
		<div id="lobby-container">
			<h1>Loading Lobby...</h1>
		</div>
	);
}
