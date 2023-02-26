import { useState, useEffect } from "react";
import Timer from "./Timer";

export default function GameRound({ roundNumber, game, socket, gameCode }) {
	const [timesUp, setTimesUp] = useState(false);
	const [currentRound, setCurrentRound] = useState(null);

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
			<p>Prompt: {currentRound.prompt}</p>
			<Timer
				timeLimit={game.timeLimit * 60}
				timesUp={timesUp}
				setTimesUp={setTimesUp}
			/>
		</div>
	) : (
		<h1>loading...</h1>
	);
}
