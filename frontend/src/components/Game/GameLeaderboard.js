import { useContext, useEffect, useState } from "react";
import { GameStateContext } from "../../context/GameState";

export default function GameLeaderboard() {
	const socket = useContext();
	const {
		players,
		setPlayers,
		setGameSection,
		setRoundNum,
		timesUp,
		setTimesUp
	} = useContext(GameStateContext);
	const [voteDataObj, setVoteDataObj] = useState({});
	const [boardReady, setBoardReady] = useState(false);

	useEffect(() => {
		socket.on("vote submitted", voteDrawingData => {
			const { playerId, drawingUrl } = voteDrawingData;
			setPlayers(prev => ({
				...prev,
				[playerId]: { score: prev[playerId].score + 100 }
			}));
			setVoteDataObj(prev => ({
				...prev,
				[playerId]: { ...players[playerId], drawingUrl }
			}));
		});

		return () => {
			setVoteDataObj({});
		};
	}, []);

	useEffect(() => {
		if (Object.keys(voteDataObj).length === Object.keys(players.length)) {
			setBoardReady(true);
		}
		return () => {
			setBoardReady(false);
		};
	}, [voteDataObj]);

	useEffect(() => {
		if (timesUp) {
			setRoundNum(prev => prev + 1);
			setTimesUp(false);
			setGameSection("round");
		}
	}, [timesUp]);

	return boardReady ? (
		<div id="leaderboard">
			<Timer timeLimit={10} message={`Here's how you all stack up...`} />
			<div id="leaderboard-container">
				{Object.keys(voteDataObj).map(key => {
					const voteData = voteDataObj[key];
					const { username, drawingUrl, score } = voteData;
					return (
						<div key={key}>
							<p>{`${username} ${score}`}</p>
							<img src={drawingUrl} alt="who knows" />
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
