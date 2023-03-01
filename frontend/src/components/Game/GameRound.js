import { useContext, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GameStateContext } from "../../context/GameState";
import { SocketContext } from "../../context/Socket";
import { Timer } from "./utils/Timer";
import GameCanvas from "../GameCanvas";
import { thunkAddDrawing } from "../../store/drawings";

export default function GameRound() {
	const dispatch = useDispatch();
	const { roundNum, setGameSection, timesUp, setTimesUp } =
		useContext(GameStateContext);
	const socket = useContext(SocketContext);
	const user = useSelector(state => state.session.user);
	const game = useSelector(state => state.games.currentGame);
	const currentRound = game.gameRounds[roundNum];
	const canvasRef = useRef(null);

	useEffect(() => {
		if (timesUp) {
			const dataURL = canvasRef.current.toDataURL("image/png");
			const formData = new FormData();
			formData.append("image", dataURL);
			formData.append("title", currentRound.prompt);

			dispatch(thunkAddDrawing(formData)).then(data => {
				socket.emit("player submitted drawing", {
					roomId: game.code,
					drawingData: {
						playerId: user.id,
						drawingId: data.id,
						drawingUrl: data.drawingUrl
					}
				});
				setTimesUp(false);
				setGameSection("vote");
			});
		}
	}, [timesUp]);

	return (
		<div id="round-container">
			<Timer timeLimit={game.timeLimit} message={`Round ${roundNum}`} />
			<GameCanvas prompt={currentRound.prompt} canvasRef={canvasRef} />
		</div>
	);
}
