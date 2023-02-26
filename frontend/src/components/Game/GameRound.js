import { useState, useEffect } from "react";
import GameCanvas from "../GameCanvas";
import Timer from "./Timer";

export default function GameRound({ roundNumber, game, socket, gameCode }) {
	const [timesUp, setTimesUp] = useState(false);
	const [currentRound, setCurrentRound] = useState(null);
	const [drawingSubmitted, setDrawingSubmitted] = useState(false);

	useEffect(() => {
		if (game) setCurrentRound(game.gameRounds[roundNumber]);
	}, [game]);

	useEffect(() => {
		if (timesUp) {
			socket.emit("times up", { gameCode, roundNumber });
			setTimesUp(false);
		}
	}, [timesUp]);

	return currentRound ? (
		<div>
			<h1>Round {roundNumber}</h1>
			<Timer
				timeLimit={game.timeLimit * 60}
				timesUp={timesUp}
				setTimesUp={setTimesUp}
			/>
			<GameCanvas
				prompt={currentRound.prompt}
				setDrawingSubmitted={setDrawingSubmitted}
			/>
		</div>
	) : (
		<h1>loading...</h1>
	);
}
