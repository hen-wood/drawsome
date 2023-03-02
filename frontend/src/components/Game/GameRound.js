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
	const game = useSelector(state => state.game);
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
			formData.append("title", game.currentRound.prompt);
			formData.append("roundId", game.currentRound.id);

			dispatch(thunkAddGameDrawing(formData, game.currentRound)).then(data => {
				socket.emit("player submitted drawing", {
					roomId: game.code,
					drawingData: data,
					roundNum: game.currentRound.roundNumber
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
				timeLimit={5}
				message={`Round ${game.currentRound.roundNumber}`}
			/>
			<GameCanvas prompt={game.currentRound.prompt} canvasRef={canvasRef} />
		</div>
	);
}
