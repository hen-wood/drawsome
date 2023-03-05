import { useContext, useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SocketContext } from "../../context/Socket";
import { Timer } from "./utils/Timer";
import GameCanvas from "../GameCanvas";
import { getLocalAsObj, updateLocalDrawings } from "./utils/localFunctions";
import { thunkAddDrawing } from "../../store/drawings";

export default function GameRound() {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const { timeLimit, currentRound, hostSocket } = getLocalAsObj("gameState");

	const canvasRef = useRef(null);
	const [time, setTime] = useState(timeLimit * 60);
	const [timesUp, setTimesUp] = useState(false);

	useEffect(() => {
		if (timesUp) {
			const dataURL = canvasRef.current.toDataURL("image/png");
			const formData = new FormData();
			formData.append("image", dataURL);
			formData.append("title", currentRound.prompt);
			formData.append("roundId", currentRound.id);

			dispatch(thunkAddDrawing(formData)).then(data => {
				const { roundId, userId } = data;
				updateLocalDrawings(roundId, userId, data);
				socket.emit("submitted drawing to host", {
					drawingData: data,
					hostSocket
				});
			});
		}
	}, [timesUp]);

	return (
		<div id="round-container">
			<Timer
				time={time}
				setTime={setTime}
				timesUp={timesUp}
				setTimesUp={setTimesUp}
				message={`Round ${currentRound.roundNumber}`}
			/>
			<GameCanvas prompt={currentRound.prompt} canvasRef={canvasRef} />
		</div>
	);
}
