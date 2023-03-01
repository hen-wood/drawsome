import { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GameStateContext } from "../../context/GameState";
import { SocketContext } from "../../context/Socket";
import { Timer } from "./utils/Timer";

export default function GameVote() {
	const {
		roundNum,
		setRoundNum,
		players,
		setGameSection,
		timesUp,
		setTimesUp
	} = useContext(GameStateContext);
	const user = useSelector(state => state.session.user);
	const game = useSelector(state => state.games.currentGame);
	const socket = useContext(SocketContext);
	const currentRound = game.gameRounds[roundNum];
	const [votingReady, setVotingReady] = useState(false);
	const [voteDrawingId, setVoteDrawingId] = useState(0);
	const [drawingDataArray, setDrawingDataArray] = useState([]);

	useEffect(() => {
		socket.on("drawing submitted", playerDrawingData => {
			setDrawingDataArray(prev => [...prev, playerDrawingData]);
		});

		return () => {
			setDrawingDataArray([]);
		};
	}, []);

	useEffect(() => {
		if (drawingDataArray.length === Object.keys(players).length) {
			setVotingReady(true);
		}
		return () => {
			setVotingReady(false);
		};
	}, [drawingDataArray]);

	useEffect(() => {
		if (timesUp) {
			if (game.gameRounds[roundNum + 1]) {
				setRoundNum(prev => prev + 1);
				setTimesUp(false);

				setGameSection("round");
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
				{drawingDataArray.map(drawingData => {
					const { playerId, drawingId, drawingUrl } = drawingData;
					return (
						<img
							key={drawingId}
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
