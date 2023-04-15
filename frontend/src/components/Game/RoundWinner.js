import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SocketContext } from "../../context/Socket";
import { useHistory } from "react-router-dom";
import { thunkEndGame } from "../../store/games";

export default function RoundWinner() {
	const dispatch = useDispatch();
	const history = useHistory();
	const user = useSelector(state => state.session.user);
	const socket = useContext(SocketContext);
	const { game, players, drawings, votes, timesUp, currentRound } = useSelector(
		state => state.gameState
	);
	const winnerId = Object.keys(votes).reduce((a, b) =>
		votes[a] > votes[b] ? a : b
	);

	useEffect(() => {
		if (timesUp) {
			if (game.creatorId === user.id && game.gameRounds[currentRound + 1]) {
				socket.emit("host-started-round", currentRound + 1, game.code);
			} else if (!game.gameRounds[currentRound + 1]) {
				dispatch(thunkEndGame(game.id)).then(() => {
					history.push(`/past-games/${game.id}`);
				});
			}
		}
	}, [timesUp]);

	return (
		<div className="round-winner__container">
			<h2 className="round-winner__title">This round's winner is...</h2>
			<p className="round-winner__name">{players[winnerId].username} 🥳</p>
			<img
				src={drawings[winnerId].drawingUrl}
				alt="winner"
				className="round-winner__drawing"
			/>
		</div>
	);
}
