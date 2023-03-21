import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import formatTime from "../../../utils/formatTime";
import loadingGif from "../../../images/loading.gif";
export const Timer = ({ time, setTime, setTimesUp, message }) => {
	const game = useSelector(state => state.game);

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
				{time > 0 && game.section === "round" ? (
					`Time Remaining: ${formatTime(time)}`
				) : time > 0 ? (
					`${time}`
				) : (
					<img src={loadingGif} alt="loading" />
				)}
			</p>
		</div>
	);
};
