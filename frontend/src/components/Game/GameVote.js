import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/Socket";
import { csrfFetch } from "../../store/csrf";
import {
	actionResetVotes,
	actionSetCurrentTimeLimit,
	actionSetGameSection,
	actionSetTimesUpFalse
} from "../../store/gameState";

export default function GameVote() {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const user = useSelector(state => state.session.user);
	const gameState = useSelector(state => state.gameState);
	const { game, players, drawings, currentRound, timesUp, votes } = gameState;
	const round = game.gameRounds[currentRound];
	const [playerVotedFor, setPlayerVotedFor] = useState(
		Object.values(players).find(player => player.id !== user.id).id
	);

	useEffect(() => {
		dispatch(actionResetVotes());
	}, []);

	useEffect(() => {
		if (timesUp) {
			const drawingId = drawings[playerVotedFor].id;
			const host = Object.values(players).find(
				player => player.id === game.creatorId
			);
			csrfFetch(`/api/drawings/${drawingId}/vote`, {
				method: "POST",
				body: JSON.stringify({ votedForId: playerVotedFor, gameId: game.id })
			})
				.then(() => {
					socket.emit("player-sent-vote", playerVotedFor, host.socketId);
				})
				.catch(async res => {
					const err = await res.json();
					console.log(err);
				});
		}
	}, [timesUp]);

	useEffect(() => {
		if (
			timesUp &&
			Object.values(votes).length === Object.values(players).length &&
			game.creatorId === user.id
		) {
			socket.emit("host-started-round-winner", votes, game.code);
		}
	}, [votes, players, timesUp]);

	return (
		<div id="vote-container-outer">
			<div id="drawing-vote-container">
				{Object.values(drawings).map(drawing => {
					const { drawingUrl, userId } = drawing;
					const isUser = user.id === userId;
					return (
						<img
							key={drawing.id}
							src={drawingUrl}
							alt={round.prompt}
							onClick={() => {
								if (!isUser) setPlayerVotedFor(userId);
							}}
							className={
								isUser
									? "disable-vote-drawing"
									: userId === playerVotedFor
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
