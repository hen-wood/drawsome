import { useState, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { thunkAddDrawing } from "../../../store/drawings";
import { GameStateContext } from "../../../context/GameState";
import { SocketContext } from "../../../context/Socket";
import formatTime from "../../../utils/formatTime";
export const Timer = ({ timeLimit }) => {
	const dispatch = useDispatch();
	const { roundNum, setTimesUp, timesUp, setGameSection } =
		useContext(GameStateContext);
	const socket = useContext(SocketContext);
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

	// useEffect(() => {
	// 	setGameSection("vote");
	// }, [timesUp]);

	return (
		<div id="timer-container">
			<p>Round {roundNum}</p>
			<p>{!timesUp ? `Time Remaining: ${formatTime(time)}` : "TIME'S UP!"}</p>
		</div>
	);
};
