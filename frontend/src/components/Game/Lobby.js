import { useSelector } from "react-redux";

import "./Game.css";
export default function Lobby({ connectedPlayers, playerCount }) {
	const user = useSelector(state => state.session.user);
	const game = useSelector(state => state.games.currentGame);

	const waitingMessage = (count, limit) => {
		const numRemaing = limit - count;
		const isCreator = user.id === game.creator.id;

		if (numRemaing === 0)
			return (
				<p>
					Waiting for {isCreator ? "you" : game.creator.username} to start the
					game
				</p>
			);

		return (
			<p>
				Waiting for {numRemaing} more player{numRemaing > 1 ? "s" : ""}
			</p>
		);
	};

	return (
		<div id="lobby-container">
			<h1>Let's play Drawsome! 🧑‍🎨</h1>
			{waitingMessage(playerCount, game.numPlayers)}
			{Object.keys(connectedPlayers).map(key => {
				const player = connectedPlayers[key];
				const isCreator = player.user.id === game.creator.id;
				return (
					<p key={key}>
						{`${isCreator ? "👑" : "✅"} ${player.user.username} ${
							isCreator ? "started the game" : "joined the game"
						}`}
					</p>
				);
			})}
		</div>
	);
}
