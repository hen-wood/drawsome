import { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkStartGame } from "../../store/games";
import { SocketContext } from "../../context/Socket";
import { copyCode, waitingMessage } from "./utils/lobbyTools";
import "./Game.css";
import { getLocalAsObj } from "./utils/localFunctions";

export default function GameLobby({ gameState, setGameState }) {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const { code, numPlayers, creatorId, id, players } = gameState;
	const user = useSelector(state => state.session.user);
	return (
		<div id="lobby-container">
			<h1>Let's play Drawsome! 🧑‍🎨</h1>
			<p id="copy-code" onClick={() => copyCode(code)}>
				copy game code: {code} 🔗
			</p>
			<div className="divider"></div>
			{waitingMessage(
				Object.keys(players).length,
				numPlayers,
				user.id,
				creatorId
			)}
			{Object.keys(players).map(key => {
				const player = players[key];
				const isCreator = player.id === creatorId;

				return (
					<p className="lobby-player" key={key}>
						{`${isCreator ? "👑" : "✅"} ${
							isCreator && user.id === creatorId
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
			{Object.keys(players).length === numPlayers && user.id === creatorId && (
				<button
					onClick={() => {
						dispatch(thunkStartGame(id)).then(() => {
							socket.emit("start game", { roomId: code });
						});
					}}
				>
					Start the game!
				</button>
			)}
		</div>
	);
}
