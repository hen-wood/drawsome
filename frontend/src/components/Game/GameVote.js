import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/Socket";
import { Timer } from "./utils/Timer";
import {
	actionSetGameSection,
	actionSetPlayerVotedFor,
	thunkAddVote
} from "../../store/games";

export default function GameVote() {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const user = useSelector(state => state.session.user);
	const game = useSelector(state => state.game);
	const roundNum = game.currentRound.roundNumber;
	const playerVotedFor = game.playerVotedFor;
	const [votingReady, setVotingReady] = useState(false);

	useEffect(() => {
		if (
			Object.keys(game.drawings[roundNum]).length ===
			Object.keys(game.players).length
		)
			setVotingReady(true);
		return () => {
			setVotingReady(false);
		};
	}, [game.drawings, roundNum, game.players]);

	useEffect(() => {
		if (game.timesUp) {
			console.log(playerVotedFor);
			console.log(game.drawings[roundNum]);
			const { drawingId } = game.drawings[roundNum][playerVotedFor];
			dispatch(thunkAddVote(drawingId, playerVotedFor)).then(() => {
				socket.emit("player submitted vote", {
					roomId: game.code,
					playerVotedFor
				});
				if (game.gameRounds[roundNum + 1]) {
					dispatch(actionSetGameSection("leaderboard"));
				} else {
					dispatch(actionSetGameSection("game end"));
				}
			});
		}
	}, [game.timesUp]);

	return votingReady ? (
		<div id="vote-container-outer">
			<Timer
				timeLimit={5}
				message={`Which one of these best captures "${game.currentRound.prompt}"?`}
			/>
			<div id="drawing-vote-container">
				{Object.keys(game.drawings[roundNum]).map(key => {
					console.log(game.players[key]);
					const playerId = game.players[key].id;
					const { drawingUrl } = game.drawings[roundNum][key];
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
