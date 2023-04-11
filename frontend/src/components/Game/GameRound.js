import { useContext, useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/Socket";
import Canvas from "../Canvas";
import { thunkAddDrawing } from "../../store/drawings";
import {
	actionSetCurrentTimeLimit,
	actionSetGameSection
} from "../../store/gameState";

export default function GameRound() {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const user = useSelector(state => state.session.user);
	const { timesUp, currentRound, players, game, drawings, creatorId } =
		useSelector(state => state.gameState);
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
				socket.emit("player-sent-drawing", data, host.socketId);
			});
		}
	}, [timesUp]);

	return (
		<>
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
