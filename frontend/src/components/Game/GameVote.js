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
	const { drawings, currentRound, players, playerVotedFor, gameRounds, code } =
		useSelector(state => state.game);
	const [timesUp, setTimesUp] = useState(false);
	const [votingReady, setVotingReady] = useState(false);

	useEffect(() => {
		const drawingKeys = Object.keys(drawings[currentRound.id]).length;
		const playerKeys = Object.keys(players).length;
		if (
			Object.keys(drawings[currentRound.id]).length ===
			Object.keys(players).length
		) {
			setVotingReady(true);
		}
		return () => {
			setVotingReady(false);
		};
	}, [game]);

	useEffect(() => {
		if (timesUp) {
			const drawingId = drawings[currentRound.id][playerVotedFor].id;
			dispatch(thunkAddVote(drawingId, playerVotedFor)).then(() => {
				socket.emit("player submitted vote", {
					roomId: code,
					playerVotedFor
				});
				if (gameRounds[currentRound.roundNumber + 1]) {
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
				timeLimit={15}
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
								if (!isUser) dispatch(actionSetPlayerVotedFor(+playerId));
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
	) : (
		<div id="vote-container-outer">
			<h1>Loading Drawings...</h1>
		</div>
	);
}
