import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SocketContext } from "../../context/Socket";
import { thunkEndGame } from "../../store/games";
import { getLocalAsObj, updateLocalCurrRound } from "./utils/localFunctions";
import { Timer } from "./utils/Timer";

export default function GameLeaderboard() {
	const dispatch = useDispatch();
	const user = useSelector(state => state.session.user);
	const socket = useContext(SocketContext);
	const {
		id,
		code,
		scores,
		drawings,
		players,
		currentRound,
		votes,
		creatorId,
		gameRounds
	} = getLocalAsObj("gameState");
	const [time, setTime] = useState(5);
	const [timesUp, setTimesUp] = useState(false);

	useEffect(() => {
		if (timesUp && creatorId === user.id) {
			if (gameRounds[currentRound.roundNumber]) {
				const hostDataStr = updateLocalCurrRound();
				socket.emit("host data after round", {
					hostDataStr,
					roomId: code
				});
			} else {
				dispatch(thunkEndGame(id))
					.then(res => {
						const hostDataStr = JSON.stringify(res);
						socket.emit("host game results", { hostDataStr, roomId: code });
					})
					.catch(async res => {
						const err = await res.json();
						console.log({ err });
					});
			}
		}
	}, [timesUp]);

	return (
		<div id="leaderboard-container">
			<Timer
				time={time}
				setTime={setTime}
				setTimesUp={setTimesUp}
				message={`Here's how you all stack up after Round ${currentRound.roundNumber}...`}
			/>
			<div id="leaderboard-cards">
				{Object.entries(scores)
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
					})}
			</div>
		</div>
	);
}
