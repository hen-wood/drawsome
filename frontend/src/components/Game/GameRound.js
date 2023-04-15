import { useContext, useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/Socket";
import Canvas from "../Canvas";
import { thunkAddDrawing } from "../../store/drawings";
import {
	actionResetDrawings,
	actionSetCurrentTimeLimit,
	actionSetGameSection,
	actionSetTimesUpFalse
} from "../../store/gameState";

export default function GameRound() {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const user = useSelector(state => state.session.user);
	const { timesUp, currentRound, players, game, drawings } = useSelector(
		state => state.gameState
	);
	const canvasRef = useRef(null);
	const [bgColor, setBgColor] = useState("#fff");

	useEffect(() => {
		dispatch(actionResetDrawings());
	}, []);

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

	useEffect(() => {
		if (
			timesUp &&
			Object.values(drawings).length === Object.values(players).length &&
			game.creatorId === user.id
		) {
			socket.emit("host-started-vote", drawings, game.code);
		}
	}, [drawings, players, timesUp]);

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
