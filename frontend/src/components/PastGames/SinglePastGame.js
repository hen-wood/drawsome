import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function SinglePastGame() {
	const { gameId } = useParams();
	const game = useSelector(state => state.game.pastGames[gameId]);

	return game ? (
		<div id="last-game-container">
			<h1>Hello from last game</h1>
		</div>
	) : (
		<h1>Loading past game...</h1>
	);
}
