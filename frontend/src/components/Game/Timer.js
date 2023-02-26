import { useState, useEffect } from "react";
import formatTime from "../../utils/formatTime";
export default function Timer({ timeLimit, setTimesUp }) {
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
		<div>
			<p>Time remaining: {formatTime(time)}</p>
		</div>
	);
}
