import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/Socket";
import { Timer } from "./utils/Timer";
import { getLocalAsObj } from "./utils/localFunctions";
import { csrfFetch } from "../../store/csrf";

export default function GameVote({ gameState, setGameState }) {
	const socket = useContext(SocketContext);
	const user = useSelector(state => state.session.user);
	const { drawings, currentRound, players, gameRounds, code, hostSocket } =
		getLocalAsObj("gameState");
	const otherId = Object.keys(players).find(key => +key !== user.id);
	const [playerVotedFor, setPlayerVotedFor] = useState(+otherId);
	const [timesUp, setTimesUp] = useState(false);
	const [time, setTime] = useState(10);

	useEffect(() => {
		if (timesUp) {
			const drawingId = drawings[currentRound.id][playerVotedFor].id;
			csrfFetch(`/api/drawings/${drawingId}/vote`, { method: "POST" })
				.then(() => {
					socket.emit("player submitted vote", {
						playerVotedFor,
						hostSocket
					});
				})
				.catch(async res => {
					const err = await res.json();
					console.log(err);
				});
		}
	}, [timesUp]);

	return (
		<div id="vote-container-outer">
			<Timer
				time={time}
				setTime={setTime}
				setTimesUp={setTimesUp}
				message={`Which one of these best captures "${currentRound.prompt}"?`}
			/>
			<div id="drawing-vote-container">
				{Object.keys(drawings[currentRound.id]).map(playerId => {
					const { drawingUrl } = drawings[currentRound.id][playerId];
					const isUser = user.id === +playerId;
					return (
						<img
							key={playerId}
							src={drawingUrl}
							alt={currentRound.prompt}
							onClick={() => {
								if (!isUser) setPlayerVotedFor(+playerId);
							}}
							className={
								isUser
									? "disable-vote-drawing"
									: +playerId === playerVotedFor
									? "vote-drawing choice"
									: "vote-drawing"
							}
						/>
					);
				})}
			</div>
		</div>
	);
}
