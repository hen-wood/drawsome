import { useState, useEffect, useContext } from "react";
import { GameStateContext } from "../../../context/GameState";
import formatTime from "../../../utils/formatTime";
export const Timer = ({ timeLimit, message }) => {
	const { setTimesUp, timesUp, gameSection } = useContext(GameStateContext);
	const [time, setTime] = useState(5);

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
		return () => {
			setTimesUp(false);
		};
	}, [time]);

	return (
		<div id="timer-container">
			<p>{`${message}`}</p>
			<p>
				{!timesUp && gameSection === "round"
					? `Time Remaining: ${formatTime(time)}`
					: !timesUp
					? `${time}`
					: "TIME'S UP!"}
			</p>
		</div>
	);
};
