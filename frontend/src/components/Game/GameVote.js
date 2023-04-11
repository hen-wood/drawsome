import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/Socket";
import { csrfFetch } from "../../store/csrf";
import {
	actionSetCurrentTimeLimit,
	actionSetGameSection,
	actionSetTimesUpFalse
} from "../../store/gameState";

export default function GameVote() {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const user = useSelector(state => state.session.user);
	const gameState = useSelector(state => state.gameState);
	const { game, players, drawings, currentRound, timesUp } = gameState;
	const round = game.gameRounds[currentRound];
	const [isLoaded, setIsLoaded] = useState(false);
	const [playerVotedFor, setPlayerVotedFor] = useState(null);

	useEffect(() => {
		if (Object.values(drawings).length === Object.values(players).length) {
			setPlayerVotedFor(
				Object.values(players).find(player => player.id !== user.id).id
			);
			if (game.creatorId === user.id) {
				dispatch(actionSetTimesUpFalse());
				socket.emit("host-started-vote", drawings, game.code);
			}
		}
	}, [drawings, players]);

	useEffect(() => {
		if (!timesUp) {
			setIsLoaded(true);
		}
		if (isLoaded && timesUp) {
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
					dispatch(actionSetCurrentTimeLimit(1));
					dispatch(actionSetGameSection("leaderboard"));
				})
				.catch(async res => {
					const err = await res.json();
					console.log(err);
				});
		}
	}, [isLoaded, timesUp]);

	return isLoaded ? (
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
	) : (
		<h1>Waiting for all drawings</h1>
	);
}
