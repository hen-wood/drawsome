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
	const { currentTimeLimit, timesUp } = useSelector(state => state.gameState);
	const isPaused = useSelector(state => state.gameState.isPaused);
	const [time, setTime] = useState(5);
	// const [time, setTime] = useState(currentTimeLimit * 10);

	useEffect(() => {
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

		return () => {
			clearInterval(intervalId);
		};
	}, [isPaused]);

	useEffect(() => {
		if (time <= 0) {
			dispatch(actionSetTimesUpTrue());
		}
	}, [time]);

	useEffect(() => {
		setTime(currentTimeLimit);
	}, [currentTimeLimit]);

	return (
		<p className="round-info round-info--right">
			{time > 0 ? `${formatTime(time)}` : "Loading..."}
		</p>
	);
};
