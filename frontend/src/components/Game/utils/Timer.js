import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import formatTime from "../../../utils/formatTime";
import {
	actionSetTimesUpTrue,
	actionSetTimesUpFalse,
	actionSetCurrentTimeLimit
} from "../../../store/gameState";
export const Timer = () => {
	const dispatch = useDispatch();
	const timeLimit = useSelector(state => state.gameState.currentTimeLimit);
	const isPaused = useSelector(state => state.gameState.isPaused);
	const [time, setTime] = useState(timeLimit * 10);

	useEffect(() => {
		dispatch(actionSetTimesUpFalse());
		const intervalId = setInterval(() => {
			if (!isPaused) {
				setTime(prevTime => {
					if (prevTime > 0) {
						return prevTime - 1;
					}
				});
			}
		}, 1000);
		if (isPaused) {
			dispatch(actionSetCurrentTimeLimit(time / 10));
		}

		return () => clearInterval(intervalId);
	}, [isPaused]);

	useEffect(() => {
		if (time <= 0) {
			dispatch(actionSetTimesUpTrue());
		}
	}, [time]);

	return (
		<p className="round-info round-info--right">
			{time > 0 ? `${formatTime(time)}` : "Loading..."}
		</p>
	);
};
