import { useContext, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SocketContext } from "../../context/Socket";
import { Timer } from "./utils/Timer";
import GameCanvas from "../GameCanvas";
import {
	thunkAddGameDrawing,
	actionSetGameSection,
	actionSetTimesUpFalse
} from "../../store/games";

export default function GameRound() {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const game = useSelector(state => state.game);
	const canvasRef = useRef(null);

	useEffect(() => {
		if (game.timesUp) {
			const dataURL = canvasRef.current.toDataURL("image/png");
			const formData = new FormData();
			formData.append("image", dataURL);
			formData.append("title", game.currentRound.prompt);
			formData.append("roundId", game.currentRound.id);

			dispatch(
				thunkAddGameDrawing(formData, game.currentRound.roundNumber)
			).then(data => {
				socket.emit("player submitted drawing", {
					roomId: game.code,
					drawingData: data,
					roundNum: game.currentRound.roundNumber
				});
			});
		}
	}, [game.timesUp]);

	return (
		<div id="round-container">
			<Timer timeLimit={5} message={`Round ${game.currentRound.roundNum}`} />
			<GameCanvas prompt={game.currentRound.prompt} canvasRef={canvasRef} />
		</div>
	);
}
