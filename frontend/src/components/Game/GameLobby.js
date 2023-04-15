import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkStartGame } from "../../store/games";
import { SocketContext } from "../../context/Socket";
import { copyCode, waitingMessage } from "./utils/lobbyTools";
import "./Game.css";

export default function GameLobby() {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const {
		game: { numPlayers, creatorId, code, id },
		players
	} = useSelector(state => state.gameState);
	const user = useSelector(state => state.session.user);

	return (
		<div className="lobby-container">
			<h1>Let's play Drawsome! 🧑‍🎨</h1>
			<button className="copy-code" onClick={() => copyCode(code)}>
				Copy game code: {code} 🔗
			</button>
			<div className="divider"></div>
			{waitingMessage(
				Object.values(players).length,
				numPlayers,
				user.id,
				creatorId
			)}
			{Object.values(players).map(player => {
				const isCreator = player.id === creatorId;

				return (
					<p className="lobby-player" key={player.id}>
						{`${isCreator ? "👑" : "✅"} ${
							isCreator && user.id === creatorId
								? "You"
								: user.id === player.id
								? "You"
								: player.username
						} ${
							isCreator && player.isConnected
								? "created the game"
								: player.isConnected
								? "joined the game"
								: "disconnected..."
						}`}
					</p>
				);
			})}
			{Object.values(players).length === numPlayers &&
				Object.values(players).every(player => player.isConnected) &&
				user.id === creatorId && (
					<button
						onClick={() => {
							dispatch(thunkStartGame(id)).then(() => {
								socket.emit("host-started-round", 0, code);
							});
						}}
					>
						Start the game!
					</button>
				)}
		</div>
	);
}
