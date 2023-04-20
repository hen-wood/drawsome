import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import GameLobby from "./GameLobby";
import GameVote from "./GameVote";
import GameRound from "./GameRound";
import { PausedWarning } from "./PausedWarning";
import "./Game.css";
import loadingGif from "../../images/loading.gif";
import useSocketListeners from "./utils";
import { thunkJoinGame } from "../../store/gameState";
import RoundWinner from "./RoundWinner";

export default function Game() {
	const dispatch = useDispatch();
	const gameState = useSelector(state => state.gameState);
	const { gameCode } = useParams();
	const [isLoaded, setIsLoaded] = useState(false);
	useSocketListeners(gameState);

	useEffect(() => {
		if (!gameState.game) {
			dispatch(thunkJoinGame(gameCode))
				.then(() => {
					setIsLoaded(true);
				})
				.catch(async res => {
					const err = await res.json();
					console.log(err);
				});
		} else {
			setIsLoaded(true);
		}
	}, [gameState.game]);

	return isLoaded ? (
		<>
			{gameState.section === "lobby" ? (
				<GameLobby />
			) : gameState.section === "round" ? (
				<GameRound />
			) : gameState.section === "vote" ? (
				<GameVote />
			) : gameState.section === "round-winner" ? (
				<RoundWinner />
			) : (
				<img src={loadingGif} alt="loading" />
			)}
			{gameState.section !== "lobby" && gameState.isPaused && <PausedWarning />}
		</>
	) : (
		<img src={loadingGif} alt="loading" />
	);
}
