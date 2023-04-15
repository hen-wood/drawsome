import { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../../context/Socket";
import {
	actionConnectPlayer,
	actionDisconnectPlayer,
	actionResetGameState,
	actionSyncWithHost,
	actionAddGameDrawing,
	actionAddVote,
	actionSetGameSection,
	actionSetCurrentTimeLimit,
	actionSyncDrawings,
	actionSetTimesUpFalse,
	actionSyncVotes,
	actionUpdateCurrentRound
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

		function handleStartRound(updatedRound) {
			dispatch(actionSetTimesUpFalse());
			dispatch(actionSetCurrentTimeLimit(gameState.game.timeLimit));
			dispatch(actionUpdateCurrentRound(updatedRound));
			dispatch(actionSetGameSection("round"));
		}

		function handleStartVote(drawings) {
			dispatch(actionSetTimesUpFalse());
			dispatch(actionSyncDrawings(drawings));
			dispatch(actionSetCurrentTimeLimit(1));
			dispatch(actionSetGameSection("vote"));
		}

		function handleStartRoundWinner(votes) {
			dispatch(actionSetTimesUpFalse());
			dispatch(actionSyncVotes(votes));
			dispatch(actionSetCurrentTimeLimit(1));
			dispatch(actionSetGameSection("round-winner"));
		}

		function handleAddDrawing(drawingData) {
			dispatch(actionAddGameDrawing(drawingData));
		}
		function handleAddVote(playerVotedFor) {
			dispatch(actionAddVote(playerVotedFor));
		}

		if (gameState) {
			socket.on("connect", handleConnect);
			socket.on("player-disconnected", handleDisconnect);
			socket.on("game-state-from-host", handleGameStateFromHost);
			socket.on("start-round", handleStartRound);
			socket.on("start-vote", handleStartVote);
			socket.on("player-drawing-to-host", handleAddDrawing);
			socket.on("start-round-winner", handleStartRoundWinner);
			socket.on("player-vote-to-host", handleAddVote);
		}

		return () => {
			socket.off("connect", handleConnect);
			socket.off("player-disconnected", handleDisconnect);
			socket.off("game-state-from-host", handleGameStateFromHost);
			socket.off("start-round", handleStartRound);
			socket.off("start-vote", handleStartVote);
			socket.off("player-drawing-to-host", handleAddDrawing);
			socket.off("start-round-winner", handleStartRoundWinner);
			socket.off("player-vote-to-host", handleAddVote);
			socket.disconnect();
			dispatch(actionResetGameState());
		};
	}, []);

	useEffect(() => {
		function handlePlayerConnected(player, socketId) {
			const isHost = gameState.game.creatorId === user.id;
			dispatch(actionConnectPlayer(player, socketId));
			if (isHost) {
				socket.emit("sync-host-one-player", gameState, socketId);
			}
		}

		socket.on("player-connected", handlePlayerConnected);

		return () => {
			socket.off("player-connected", handlePlayerConnected);
		};
	}, [gameState]);
}
