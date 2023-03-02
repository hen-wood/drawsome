import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	actionResetVotes,
	actionSetCurrentRound,
	actionSetGameSection
} from "../../store/games";
import { Timer } from "./utils/Timer";

export default function GameLeaderboard() {
	const dispatch = useDispatch();
	const game = useSelector(state => state.game);
	const [timesUp, setTimesUp] = useState(false);
	const [boardReady, setBoardReady] = useState(false);

	useEffect(() => {
		if (game.voteCount === Object.keys(game.players).length) {
			setBoardReady(true);
		}
	}, [game]);

	useEffect(() => {
		if (timesUp) {
			dispatch(actionSetCurrentRound(game.currentRound.roundNumber + 1));
			dispatch(actionSetGameSection("round"));
		}
	}, [timesUp]);

	return boardReady ? (
		<div id="leaderboard-container">
			<Timer
				timesUp={timesUp}
				setTimesUp={setTimesUp}
				timeLimit={5}
				message={`Here's how you all stack up after Round ${game.currentRound.roundNumber}...`}
			/>
			<div id="leaderboard-cards">
				{Object.keys(game.players).map(key => {
					const { username, id } = game.players[key];
					const { drawingUrl, title } = game.drawings[game.currentRound.id];
					const score = game.scores[id];
					return (
						<div key={key} className="leaderboard-card">
							<img src={drawingUrl} alt={title} />
							<p>{`${username} ${score}`}</p>
						</div>
					);
				})}
			</div>
		</div>
	) : (
		<div id="leaderboard">
			<h1>Loading leaderboard...</h1>
		</div>
	);
}
