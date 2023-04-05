import { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../../context/Socket";
import {
	actionConnectPlayer,
	actionDisconnectPlayer,
	actionResetGameState,
	actionStartGame,
	actionSyncWithHost,
	actionUnpauseGame
} from "../../../store/gameState";
import { useParams } from "react-router-dom";
export default function useSocketListeners(gameState) {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const user = useSelector(state => state.session.user);
	const { gameCode } = useParams();

	useEffect(() => {
		function handleConnect() {
			dispatch(actionConnectPlayer(user, socket.id));
			socket.emit("client-connected", user, socket.id, gameCode);
		}

		function handleDisconnect(socketId) {
			dispatch(actionDisconnectPlayer(socketId));
		}

		function handleGameStateFromHost(gameState) {
			dispatch(actionSyncWithHost(gameState));
		}

		function handleStartGame() {
			dispatch(actionStartGame());
		}

		if (gameState) {
			socket.on("connect", handleConnect);
			socket.on("player-disconnected", handleDisconnect);
			socket.on("game-state-from-host", handleGameStateFromHost);
			socket.on("start-game", handleStartGame);
		}

		return () => {
			socket.off("connect", handleConnect);
			socket.off("player-disconnected", handleDisconnect);
			socket.off("game-state-from-host", handleGameStateFromHost);
			socket.off("start-game", handleStartGame);
			socket.disconnect();
			dispatch(actionResetGameState());
		};
	}, []);

	useEffect(() => {
		function handlePlayerConnected(player, socketId) {
			const isHost = gameState.game.creatorId === user.id;
			dispatch(actionConnectPlayer(player, socketId));
			if (isHost) {
				socket.emit("host-sent-game-state", gameState, socketId);
			}
		}

		socket.on("player-connected", handlePlayerConnected);

		return () => {
			socket.off("player-connected", handlePlayerConnected);
		};
	}, [gameState]);
}
