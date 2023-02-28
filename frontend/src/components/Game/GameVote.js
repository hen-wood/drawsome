import { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GameStateContext } from "../../context/GameState";
import { SocketContext } from "../../context/Socket";
import { csrfFetch } from "../../store/csrf";
import { Timer } from "./utils/Timer";

export default function GameVote() {
	const { roundNum, setRoundNum, playerCount } = useContext(GameStateContext);
	const game = useSelector(state => state.games.currentGame);
	const socket = useContext(SocketContext);
	const currentRound = game.gameRounds[roundNum];
	const [votingReady, setVotingReady] = useState(false);
	const [votingOver, setVotingOver] = useState(false);
	const [drawingDataArray, setDrawingDataArray] = useState([]);

	useEffect(() => {
		socket.on("drawing submitted", playerDrawingData => {
			setDrawingDataArray(prev => [...prev, playerDrawingData]);
		});

		return () => {
			setDrawingDataArray([]);
		};
	}, []);

	useEffect(() => {
		if (drawingDataArray.length === playerCount) {
			setVotingReady(true);
		}
		return () => {
			setVotingReady(false);
		};
	}, [drawingDataArray]);
	return (
		<div id="voting-container">
			{drawingDataArray.map(drawingData => {
				const { username } = drawingData.player;
			})}
		</div>
	);
}
