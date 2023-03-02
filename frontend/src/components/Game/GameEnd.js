import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function GameEnd() {
	const { scores, players, voteCount } = useSelector(state => state.game);
	const [boardReady, setBoardReady] = useState(false);

	useEffect(() => {
		if (voteCount === Object.keys(players).length) {
			setBoardReady(true);
		}
	}, [voteCount, players]);

	return boardReady ? (
		<div id="leaderboard-container">
			<p>Final scores</p>
			<div id="leaderboard-cards">
				{Object.entries(scores)
					.sort((a, b) => b[1] - a[1])
					.map(entry => {
						const [playerId, score] = entry;
						const { username } = players[playerId];
						return (
							<div key={playerId} className="leaderboard-card">
								<div className="leaderboard-card-user-info">
									<p className="leaderboard-username">{`${username}`}</p>
									<p>Total score: {score}</p>
								</div>
							</div>
						);
					})}
			</div>
		</div>
	) : (
		<div id="leaderboard">
			<h1>Loading final leaderboard...</h1>
		</div>
	);
}
