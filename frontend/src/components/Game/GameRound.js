import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function GameRound({ roundNumber }) {
	const game = useSelector(state => state.games.currentGame);
	const [currentRound, setCurrentRound] = useState(null);
	const [secondsLeft, setSecondsLeft] = useState(0);
	const [timesUp, setTimesUp] = useState(false);

	useEffect(() => {
		if (game) {
			setCurrentRound(game.gameRounds[roundNumber]);
			setSecondsLeft(game.timeLimit * 60);
		}
	}, [game, roundNumber]);

	useEffect(() => {
		let timer;
		if (secondsLeft > 0) {
			timer = setInterval(() => {
				setSecondsLeft(prev => prev - 1);
			}, 1000);
		} else {
			setTimesUp(true);
		}
		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		currentRound && (
			<div>
				<p>{currentRound.prompt}</p>
				<p>{secondsLeft}</p>
			</div>
		)
	);
}
