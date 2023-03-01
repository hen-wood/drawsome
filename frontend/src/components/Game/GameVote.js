import { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GameStateContext } from "../../context/GameState";
import { SocketContext } from "../../context/Socket";
import { Timer } from "./utils/Timer";
import { csrfFetch } from "../../store/csrf";

export default function GameVote() {
	const { roundNum, players, setGameSection, timesUp, setTimesUp } =
		useContext(GameStateContext);
	const user = useSelector(state => state.session.user);
	const game = useSelector(state => state.games.currentGame);
	const socket = useContext(SocketContext);
	const currentRound = game.gameRounds[roundNum];
	const [votingReady, setVotingReady] = useState(false);
	const [voteDrawingId, setVoteDrawingId] = useState(0);
	const [drawingDataObj, setDrawingDataObj] = useState({});

	useEffect(() => {
		socket.on("drawing submitted", playerDrawingData => {
			const { playerId, drawingId } = playerDrawingData;
			if (user.id !== playerId) setVoteDrawingId(drawingId);
			setDrawingDataObj(prev => ({
				...prev,
				[drawingId]: playerDrawingData
			}));
		});

		return () => {
			setDrawingDataObj({});
		};
	}, []);

	useEffect(() => {
		if (Object.keys(drawingDataObj).length === Object.keys(players).length) {
			setVotingReady(true);
		}
		return () => {
			setVotingReady(false);
		};
	}, [drawingDataObj]);

	useEffect(() => {
		if (timesUp) {
			if (game.gameRounds[roundNum + 1]) {
				csrfFetch(`/api/drawings/${voteDrawingId}/vote`, {
					method: "POST"
				}).then(() => {
					socket.emit("player submitted vote", {
						roomId: game.code,
						voteDrawingData: drawingDataObj[voteDrawingId]
					});
					setTimesUp(false);
					setGameSection("leaderboard");
				});
			} else {
				setGameSection("game end");
			}
		}
	}, [timesUp]);

	return votingReady ? (
		<div id="vote-container-outer">
			<Timer
				timeLimit={20}
				message={`Which one of these best captures "${currentRound.prompt}"?`}
			/>
			<div id="drawing-vote-container">
				{Object.keys(drawingDataObj).map(key => {
					const drawingData = drawingDataObj[key];
					const { playerId, drawingId, drawingUrl } = drawingData;
					return (
						<img
							key={key}
							src={drawingUrl}
							alt={currentRound.prompt}
							onClick={() => setVoteDrawingId(drawingId)}
							className={
								user.id === playerId
									? "disable-vote-drawing"
									: drawingId === voteDrawingId
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
