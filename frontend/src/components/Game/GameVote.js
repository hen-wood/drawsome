import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/Socket";
import { Timer } from "./utils/Timer";
import { getLocalAsObj } from "./utils/localFunctions";
import { csrfFetch } from "../../store/csrf";

export default function GameVote() {
	const socket = useContext(SocketContext);
	const user = useSelector(state => state.session.user);
	// const {players, drawings,currentRound,}
	const otherId = Object.keys(players).find(key => +key !== user.id);
	const [playerVotedFor, setPlayerVotedFor] = useState(+otherId);

	useEffect(() => {
		if (timesUp) {
			const drawingId = drawings[currentRound.id][playerVotedFor].id;
			csrfFetch(`/api/drawings/${drawingId}/vote`, {
				method: "POST",
				body: JSON.stringify({ votedForId: playerVotedFor, gameId: id })
			})
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
