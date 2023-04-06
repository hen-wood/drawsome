import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { SocketContext } from "../../context/Socket";
import GameLobby from "./GameLobby";
import GameVote from "./GameVote";
import GameRound from "./GameRound";
import GameLeaderboard from "./GameLeaderboard";
import "./Game.css";
import loadingGif from "../../images/loading.gif";
import useSocketListeners from "./utils";
import { actionResetGameState, thunkJoinGame } from "../../store/gameState";

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
		<div>
			{gameState.section === "lobby" ? (
				<GameLobby />
			) : gameState.section === "round" ? (
				<GameRound />
			) : gameState.section === "vote" ? (
				<GameVote />
			) : gameState.section === "leaderboard" ? (
				<GameLeaderboard />
			) : (
				<img src={loadingGif} alt="loading" />
			)}
		</div>
	) : (
		<img src={loadingGif} alt="loading" />
	);
}
