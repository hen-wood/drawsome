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
	const roundNum = game.currentRound.roundNum;
	const [boardReady, setBoardReady] = useState(false);

	useEffect(() => {
		if (game.voteCount === Object.keys(game.players).length) {
			dispatch(actionResetVotes());
			setBoardReady(true);
		}
		return () => {
			setBoardReady(false);
		};
	}, [game.voteCount]);

	useEffect(() => {
		if (game.timesUp) {
			dispatch(actionSetCurrentRound(roundNum + 1));
			dispatch(actionSetGameSection("round"));
		}
	}, [game.timesUp]);

	return boardReady ? (
		<div id="leaderboard-container">
			<Timer
				timeLimit={5}
				message={`Here's how you all stack up after Round ${roundNum}...`}
			/>
			<div id="leaderboard-cards">
				{Object.keys(game.players).map(key => {
					const { username, id } = game.players[key];
					const { drawingUrl, title } = game.drawings[roundNum];
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
