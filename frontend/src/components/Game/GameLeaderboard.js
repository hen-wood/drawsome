import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { actionSetCurrentRound, actionSetGameSection } from "../../store/games";
import { Timer } from "./utils/Timer";

export default function GameLeaderboard() {
	const dispatch = useDispatch();
	const { scores, drawings, players, currentRound, voteCount } = useSelector(
		state => state.game
	);
	const [timesUp, setTimesUp] = useState(false);
	const [boardReady, setBoardReady] = useState(false);

	useEffect(() => {
		if (voteCount === Object.keys(players).length) {
			setBoardReady(true);
		}
	}, [voteCount, players]);

	useEffect(() => {
		if (timesUp) {
			dispatch(actionSetCurrentRound(currentRound.roundNumber + 1));
			dispatch(actionSetGameSection("round"));
		}
	}, [timesUp]);

	return boardReady ? (
		<div id="leaderboard-container">
			<Timer
				timesUp={timesUp}
				setTimesUp={setTimesUp}
				timeLimit={5}
				message={`Here's how you all stack up after Round ${currentRound.roundNumber}...`}
			/>
			<div id="leaderboard-cards">
				{Object.keys(players).map(key => {
					const { username, id } = players[key];
					const { drawingUrl, title, votes } = drawings[currentRound.id][id];
					const score = scores[id];
					return (
						<div key={key} className="leaderboard-card">
							<div className="leaderboard-card-user-info">
								<p className="leaderboard-username">{`${username}`}</p>
								<p>Votes this round: {votes}</p>
								<p>Total score: {score}</p>
							</div>
							<img src={drawingUrl} alt={title} />
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
