import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export function PausedWarning() {
	const players = useSelector(state => state.gameState.players);
	const [disconnectedPlayers, setDisconnectedPlayers] = useState([]);

	useEffect(() => {
		if (players)
			setDisconnectedPlayers(
				Object.values(players).filter(player => !player.isConnected)
			);
	}, [players]);

	return (
		<div className="disconnect-warning">
			<div className="disconnect-warning__inner">
				<h2>Waiting for players to reconnect...</h2>
				{disconnectedPlayers.map(player => {
					return <p key={player.id}>🔌{player.username}</p>;
				})}
			</div>
		</div>
	);
}
