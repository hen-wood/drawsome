import { useState, useEffect } from "react";
import formatTime from "../../utils/formatTime";
export default function Timer({ timeLimit, setTimesUp, roundNumber }) {
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
			setTimesUp(true);
		}
	}, [time]);

	return (
		<div id="timer-container">
			<p>Round {roundNumber}</p>
			<p>Time Remaining: {formatTime(time)}</p>
		</div>
	);
}
