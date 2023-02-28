import { useState, useEffect, useContext } from "react";
import { GameStateContext } from "../../../context/GameState";
import formatTime from "../../../utils/formatTime";
export const Timer = ({ timeLimit, nextSection }) => {
	const { setGameSection, roundNum } = useContext(GameStateContext);
	const [time, setTime] = useState(timeLimit);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTime(prevTime => prevTime - 1);
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		if (time <= 0) {
			setTime();
			setGameSection(nextSection);
		}
	}, [time]);

	return (
		<div id="timer-container">
			<p>Round {roundNum}</p>
			<p>{time > 0 ? `Time Remaining: ${formatTime(time)}` : "TIME'S UP!"}</p>
		</div>
	);
};
