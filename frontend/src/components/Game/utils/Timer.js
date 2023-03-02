import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import formatTime from "../../../utils/formatTime";
export const Timer = ({ timeLimit, message, setTimesUp, timesUp }) => {
	const game = useSelector(state => state.game);
	const [time, setTime] = useState(timeLimit);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTime(prevTime => prevTime - 1);
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		if (time <= 0) {
			setTimesUp(true);
		}
	}, [time]);

	return (
		<div id="timer-container">
			<p>{`${message}`}</p>
			<p>
				{!timesUp && game.section === "round"
					? `Time Remaining: ${formatTime(time)}`
					: !timesUp
					? `${time}`
					: "loading..."}
			</p>
		</div>
	);
};
