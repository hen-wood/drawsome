import { useContext } from "react";
import { useSelector } from "react-redux";
import { GameStateContext } from "../../context/GameState";
import GameCanvas from "../GameCanvas";
import { Timer } from "./utils/Timer";

export default function GameRound({
	roundNumber,
	setTimesUp,
	timesUp,
	setDrawingSubmitted
}) {
	const { roundNum } = useContext(GameStateContext);
	const game = useSelector(state => state.games.currentGame);
	const currentRound = game.gameRounds[roundNum];

	return (
		<div id="round-container">
			<Timer timeLimit={game.timeLimit * 60} nextSection={"vote"} />
			<GameCanvas
				prompt={currentRound.prompt}
				setDrawingSubmitted={setDrawingSubmitted}
			/>
		</div>
	);
}
