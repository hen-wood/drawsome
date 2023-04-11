import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SocketContext } from "../../context/Socket";
import {
	actionResetDrawings,
	actionSetCurrentTimeLimit,
	actionSetGameSection,
	actionSetTimesUpFalse,
	actionUpdateCurrentRound
} from "../../store/gameState";

export default function GameLeaderboard() {
	const dispatch = useDispatch();
	const user = useSelector(state => state.session.user);
	const gameState = useSelector(state => state.gameState);
	const { game, players, drawings, votes, timesUp } = gameState;
	const socket = useContext(SocketContext);

	useEffect(() => {
		dispatch(actionSetTimesUpFalse());
	}, []);

	useEffect(() => {
		if (timesUp) {
			dispatch(actionSetCurrentTimeLimit(game.timeLimit));
			dispatch(actionResetDrawings());
			dispatch(actionUpdateCurrentRound());
			dispatch(actionSetGameSection("round"));
		}
	}, [timesUp]);

	return (
		<div id="leaderboard-container">
			<div id="leaderboard-cards">
				{Object.values(drawings)
					.sort((a, b) => a.votes - b.votes)
					.map(drawing => (
						<img src={drawing.drawingUrl} />
					))}
				{/* {Object.entries(scores)
					.sort((a, b) => b[1] - a[1])
					.map((entry, i) => {
						const [playerId, score] = entry;
						const { username } = players[playerId];
						const { drawingUrl, title } = drawings[currentRound.id][playerId];
						return (
							<div key={playerId} className="leaderboard-card">
								<div className="leaderboard-card-user-info">
									<p className="leaderboard-username">{`${
										i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : ""
									} ${username}`}</p>
									<p>Votes this round: {votes[playerId]}</p>
									<p>Total score: {score}</p>
								</div>
								<img src={drawingUrl} alt={title} />
							</div>
						);
					})} */}
			</div>
		</div>
	);
}
