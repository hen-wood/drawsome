import { useState, useEffect } from "react";
import GameCanvas from "../GameCanvas";
import Timer from "./Timer";

export default function GameRound({
	roundNumber,
	game,
	setTimesUp,
	timesUp,
	setDrawingSubmitted
}) {
	const [currentRound, setCurrentRound] = useState(null);

	useEffect(() => {
		if (game) setCurrentRound(game.gameRounds[roundNumber]);
	}, [game]);

	useEffect(() => {
		if (timesUp) {
			setTimesUp(true);
		}
	}, [timesUp]);

	return currentRound ? (
		<div id="round-container">
			<Timer
				roundNumber={roundNumber}
				timeLimit={game.timeLimit * 60}
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
