import { useContext, useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SocketContext } from "../../context/Socket";
import { Timer } from "./utils/Timer";
import GameCanvas from "../GameCanvas";
import {
	actionResetVotes,
	actionSetGameSection,
	thunkAddGameDrawing
} from "../../store/games";

export default function GameRound() {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const { timeLimit, currentRound, code } = useSelector(state => state.game);
	const canvasRef = useRef(null);
	const [timesUp, setTimesUp] = useState(false);

	useEffect(() => {
		dispatch(actionResetVotes());
	}, []);

	useEffect(() => {
		if (timesUp) {
			const dataURL = canvasRef.current.toDataURL("image/png");
			const formData = new FormData();
			formData.append("image", dataURL);
			formData.append("title", currentRound.prompt);
			formData.append("roundId", currentRound.id);

			dispatch(thunkAddGameDrawing(formData, currentRound)).then(data => {
				socket.emit("player submitted drawing", {
					roomId: code,
					drawingData: data,
					roundNum: currentRound.roundNumber
				});
				dispatch(actionSetGameSection("vote"));
			});
		}
	}, [timesUp]);

	return (
		<div id="round-container">
			<Timer
				timesUp={timesUp}
				setTimesUp={setTimesUp}
				timeLimit={15}
				message={`Round ${currentRound.roundNumber}`}
			/>
			<GameCanvas prompt={currentRound.prompt} canvasRef={canvasRef} />
		</div>
	);
}
