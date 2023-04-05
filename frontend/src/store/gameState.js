import { csrfFetch } from "./csrf";
const SET_GAME = "gameState/SET_GAME";
const CONNECT_PLAYER = "gameState/CONNECT_PLAYER";
const DISCONNECT_PLAYER = "gameState/DISCONNECT_PLAYER";
const START_GAME = "gameState/START_GAME";
const SET_TIMES_UP_TRUE = "gameState/SET_TIMES_UP_TRUE";
const SET_TIMES_UP_FALSE = "gameState/SET_TIMES_UP_FALSE";
const SET_CURRENT_TIME_LIMIT = "gameState/SET_CURRENT_TIME_LIMIT";
const ADD_DRAWING = "gameState/ADD_DRAWING";
const SYNC_WITH_HOST = "gameState/SYNC_WITH_HOST";
const RESET_GAME_STATE = "gameState/RESET_GAME_STATE";

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

export const actionStartGame = () => {
	return {
		type: START_GAME
	};
};

export const actionSetTimesUpTrue = () => {
	return {
		type: SET_TIMES_UP_TRUE
	};
};
export const actionSetTimesUpFalse = () => {
	return {
		type: SET_TIMES_UP_FALSE
	};
};

export const actionSetCurrentTimeLimit = limit => {
	return {
		type: SET_CURRENT_TIME_LIMIT,
		payload: limit
	};
};

export const actionAddDrawing = (roundId, artistId, url) => {
	return {
		type: ADD_DRAWING,
		payload: { roundId, artistId, url }
	};
};

export const actionResetGameState = () => {
	return {
		type: RESET_GAME_STATE
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

const initialState = {
	game: null,
	currentRound: 0,
	players: {},
	drawings: {},
	section: "lobby",
	timesUp: false,
	isPaused: false,
	currentTimeLimit: 2
};

const gameStateReducer = (state = initialState, action) => {
	let newState;
	let allPlayersConnected;
	switch (action.type) {
		case SET_GAME:
			return {
				...state,
				game: action.payload,
				currentTimeLimit: action.payload.timeLimit
			};
		case CONNECT_PLAYER:
			newState = {
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
			allPlayersConnected = Object.values(newState.players).every(
				player => player.isConnected
			);

			if (allPlayersConnected) newState.isPaused = false;
			return newState;
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
				},
				isPaused: true
			};
		case START_GAME:
			return {
				...state,
				game: { ...state.game, hasStarted: true },
				section: "round"
			};
		case SYNC_WITH_HOST:
			newState = {
				...action.payload,
				players: { ...action.payload.players, ...state.players }
			};
			allPlayersConnected = Object.values(newState.players).every(
				player => player.isConnected
			);

			if (allPlayersConnected) newState.isPaused = false;
			return newState;
		case SET_TIMES_UP_TRUE:
			return { ...state, timesUp: true };
		case SET_TIMES_UP_TRUE:
			return { ...state, timesUp: false };
		case SET_CURRENT_TIME_LIMIT:
			return { ...state, currentTimeLimit: action.payload };
		case ADD_DRAWING:
			return {
				...state,
				drawings: {
					...state.drawings,
					[action.payload.roundId]: { ...action.payload }
				}
			};
		case RESET_GAME_STATE:
			return initialState;
		default:
			return state;
	}
};

export default gameStateReducer;
