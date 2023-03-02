import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkStartGame } from "../../store/games";
import { SocketContext } from "../../context/Socket";
import { copyCode, waitingMessage } from "./utils/lobbyTools";
import "./Game.css";

export default function GameLobby() {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const game = useSelector(state => state.game);
	const user = useSelector(state => state.session.user);

	return (
		<div id="lobby-container">
			<h1>Let's play Drawsome! 🧑‍🎨</h1>
			<p id="copy-code" onClick={() => copyCode(game.code)}>
				copy game code: {game.code} 🔗
			</p>
			<div className="divider"></div>
			{waitingMessage(
				Object.keys(game.players).length,
				game.numPlayers,
				user.id,
				game.creatorId
			)}
			{Object.keys(game.players).map(key => {
				const player = game.players[key];
				const isCreator = player.id === game.creatorId;

				return (
					<p className="lobby-player" key={key}>
						{`${isCreator ? "👑" : "✅"} ${
							isCreator && user.id === game.creatorId
								? "You"
								: user.id === player.id
								? "You"
								: player.username
						} ${
							isCreator && player.connected
								? "created the game"
								: player.connected
								? "joined the game"
								: "disconnected..."
						}`}
					</p>
				);
			})}
			{user.id === game.creatorId && (
				<button
					onClick={() => {
						dispatch(thunkStartGame(game.id)).then(() => {
							socket.emit("start game", { roomId: game.code });
						});
					}}
				>
					Start the game!
				</button>
			)}
		</div>
	);
}
