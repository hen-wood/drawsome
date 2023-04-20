import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import formatTime from "../../../utils/formatTime";
import {
	actionSetTimesUpTrue,
	actionSetCurrentTimeLimit
} from "../../../store/gameState";
export const Timer = () => {
	const dispatch = useDispatch();
	const { currentTimeLimit, isPaused, section } = useSelector(
		state => state.gameState
	);
	const [time, setTime] = useState(currentTimeLimit * 60);

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
			dispatch(actionSetCurrentTimeLimit(time / 60));
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
		setTime(currentTimeLimit * 60);
	}, [currentTimeLimit, section]);

	return (
		<p className="round-info round-info--right">
			{isPaused
				? "Game paused..."
				: time > 0
				? `${formatTime(time)}`
				: "Loading..."}
		</p>
	);
};
