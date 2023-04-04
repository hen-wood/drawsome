import { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../../context/Socket";
import {
	actionConnectPlayer,
	actionDisconnectPlayer,
	actionSyncWithHost
} from "../../../store/gameState";

function emitClientConnected(socket, gameState, user) {
	const gameCode = gameState.game.code;
	socket.emit("client-connected", user, socket.id, gameCode);
}

export default function useSocketListeners(gameState) {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const user = useSelector(state => state.session.user);
	const isHost = gameState.game.creatorId === user.id;

	useEffect(() => {
		socket.on("connect", () => {
			dispatch(actionConnectPlayer(user, socket.id));
			emitClientConnected(socket, gameState, user);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		socket.on("player-connected", (user, socketId) => {
			dispatch(actionConnectPlayer(user, socketId));
			if (isHost) socket.emit("host-sent-game-state", gameState, socketId);
		});

		socket.on("player-disconnected", socketId => {
			dispatch(actionDisconnectPlayer(socketId));
		});

		socket.on("game-state-from-host", gameState => {
			dispatch(actionSyncWithHost(gameState));
		});
	}, [gameState]);
}
