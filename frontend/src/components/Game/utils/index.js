import { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../../context/Socket";
import {
	actionConnectPlayer,
	actionDisconnectPlayer,
	actionSyncWithHost
} from "../../../store/gameState";
export default function useSocketListeners(gameState) {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const user = useSelector(state => state.session.user);
	const gameCode = gameState.game.code;
	const isHost = gameState.game.creatorId === user.id;

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

		socket.on("connect", handleConnect);
		socket.on("player-disconnected", handleDisconnect);
		socket.on("game-state-from-host", handleGameStateFromHost);

		return () => {
			socket.off("connect", handleConnect);
			socket.off("player-disconnected", handleDisconnect);
			socket.off("game-state-from-host", handleGameStateFromHost);
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		function handlePlayerConnected(user, socketId) {
			dispatch(actionConnectPlayer(user, socketId));
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
