import { csrfFetch } from "./csrf";
const SET_GAME = "gameState/SET_GAME";
const CONNECT_PLAYER = "gameState/CONNECT_PLAYER";
const DISCONNECT_PLAYER = "gameState/DISCONNECT_PLAYER";
const SYNC_WITH_HOST = "game/SYNC_WITH_HOST";

export const actionSetGame = game => {
	return {
		type: SET_GAME,
		payload: game
	};
};

export const actionConnectPlayer = (user, socketId) => {
	return {
		type: CONNECT_PLAYER,
		payload: { user, socketId }
	};
};

export const actionDisconnectPlayer = socketId => {
	return {
		type: DISCONNECT_PLAYER,
		payload: socketId
	};
};

export const actionSyncWithHost = hostGameState => {
	return {
		type: SYNC_WITH_HOST,
		payload: hostGameState
	};
};

export const thunkCreateGame = (newGame, user) => async dispatch => {
	const response = await csrfFetch(`/api/games`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(newGame)
	});
	if (response.ok) {
		const game = await response.json();
		dispatch(actionSetGame(game));
		return game.code;
	} else {
		const err = await response.json();
		return err;
	}
};

export const thunkJoinGame = gameCode => async dispatch => {
	const response = await csrfFetch(`/api/games/${gameCode}`);
	if (response.ok) {
		const game = await response.json();
		dispatch(actionSetGame(game));
		return game.code;
	} else {
		return response;
	}
};
// .then(res => res.json())
// .then(game => {
// 	setLocalFromObj("gameState", game);
// 	history.push(`/game/${gameCode}`);
// 	return;
// })
// .catch(async res => {
// 	const err = await res.json();
// 	setError(err.message);
// 	setGameCode("");
// 	return;
// });

const initialState = {
	game: null,
	currentRound: 0,
	players: {},
	section: "lobby"
};

const gameStateReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_GAME:
			return {
				...state,
				game: action.payload
			};
		case CONNECT_PLAYER:
			return {
				...state,
				players: {
					...state.players,
					[action.payload.user.id]: {
						...action.payload.user,
						isConnected: true,
						socketId: action.payload.socketId
					}
				}
			};
		case DISCONNECT_PLAYER:
			const player = Object.values(state.players).find(
				p => p.socketId === action.payload
			);
			return {
				...state,
				players: {
					...state.players,
					[player.id]: {
						...state.players[player.id],
						isConnected: false
					}
				}
			};
		case SYNC_WITH_HOST:
			return {
				...action.payload,
				players: { ...action.payload.players, ...state.players }
			};
		default:
			return state;
	}
};

export default gameStateReducer;
