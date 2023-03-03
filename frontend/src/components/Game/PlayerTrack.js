import { useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../context/Socket";
export default function PlayerTrack() {
	const players = useSelector(state => state.game.players);
	const socket = useContext(SocketContext);

	return (
		<div id="player-track-outer">
			{Object.values(players).map(player => {
				return (
					<p key={player.id}>
						{player.username}:{" "}
						{player.connected ? "connected" : "disconnected..."}
					</p>
				);
			})}
		</div>
	);
}
