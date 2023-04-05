import { useContext, useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/Socket";
import { Timer } from "./utils/Timer";
import Canvas from "../Canvas";
import { getLocalAsObj, updateLocalDrawings } from "./utils/localFunctions";
import { thunkAddDrawing } from "../../store/drawings";

export default function GameRound() {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const { timesUp, currentRound, players, game } = useSelector(
		state => state.gameState
	);
	const user = useSelector(state => state.session.user);
	const canvasRef = useRef(null);
	const [bgColor, setBgColor] = useState("#fff");

	useEffect(() => {
		if (timesUp) {
			const host = Object.values(players).find(
				player => player.id === game.creatorId
			);
			const dataURL = canvasRef.current.getDataURL("image/png", false, bgColor);
			const formData = new FormData();
			formData.append("image", dataURL);
			formData.append("title", game.gameRounds[currentRound].prompt);
			formData.append("roundId", game.gameRounds[currentRound].id);

			dispatch(thunkAddDrawing(formData)).then(data => {
				const { roundId, userId } = data;
				socket.emit("submitted drawing to host", {
					drawingData: data,
					hostSocket: host.socketId
				});
			});
		}
	}, [timesUp]);

	return (
		<>
			{/* <Timer
				time={time}
				setTime={setTime}
				timesUp={timesUp}
				setTimesUp={setTimesUp}
				message={`Round ${currentRound.roundNumber}`}
			/> */}
			<Canvas
				canvasRef={canvasRef}
				bgColor={bgColor}
				setBgColor={setBgColor}
				isGameCanvas={true}
				title={game.gameRounds[currentRound].prompt}
			/>
		</>
	);
}
