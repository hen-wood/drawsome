import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/Socket";
import { Timer } from "./utils/Timer";
import {
	actionSetGameSection,
	actionSetPlayerVotedFor,
	actionSetTimesUpFalse,
	thunkAddVote
} from "../../store/games";

export default function GameVote() {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const user = useSelector(state => state.session.user);
	const game = useSelector(state => state.game);
	const playerVotedFor = game.playerVotedFor;
	const [timesUp, setTimesUp] = useState(false);
	const [votingReady, setVotingReady] = useState(false);

	useEffect(() => {
		const drawingKeys = Object.keys(game.drawings[game.currentRound.id]).length;
		const playerKeys = Object.keys(game.players).length;
		if (
			Object.keys(game.drawings[game.currentRound.id]).length ===
			Object.keys(game.players).length
		) {
			setVotingReady(true);
		}
		return () => {
			setVotingReady(false);
		};
	}, [game]);

	useEffect(() => {
		if (timesUp) {
			const drawingId = game.drawings[game.currentRound.id][playerVotedFor].id;
			dispatch(thunkAddVote(drawingId, playerVotedFor)).then(() => {
				socket.emit("player submitted vote", {
					roomId: game.code,
					playerVotedFor
				});
				if (game.gameRounds[game.currentRound.roundNumber + 1]) {
					dispatch(actionSetGameSection("leaderboard"));
				} else {
					dispatch(actionSetGameSection("game end"));
				}
			});
		}
	}, [timesUp]);

	return votingReady ? (
		<div id="vote-container-outer">
			<Timer
				timesUp={timesUp}
				setTimesUp={setTimesUp}
				timeLimit={5}
				message={`Which one of these best captures "${game.currentRound.prompt}"?`}
			/>
			<div id="drawing-vote-container">
				{Object.keys(game.drawings[game.currentRound.id]).map(key => {
					const playerId = game.players[key].id;
					const { drawingUrl } = game.drawings[game.currentRound.id][key];
					const isUser = user.id === playerId;
					return (
						<img
							key={key}
							src={drawingUrl}
							alt={game.currentRound.prompt}
							onClick={() => {
								if (!isUser) dispatch(actionSetPlayerVotedFor(playerId));
							}}
							className={
								isUser
									? "disable-vote-drawing"
									: playerId === playerVotedFor
									? "vote-drawing choice"
									: "vote-drawing"
							}
						/>
					);
				})}
			</div>
		</div>
	) : (
		<div id="vote-container-outer">
			<h1>Loading Drawings...</h1>
		</div>
	);
}
