// Constants

import { csrfFetch } from "./csrf";

const SET_CURRENT_GAME = "games/SET_CURRENT_GAME";
const START_GAME = "games/START_GAME";
const ADD_PLAYER = "games/ADD_PLAYER";
const REMOVE_PLAYER = "games/REMOVE_PLAYER";
const SET_CURRENT_PLAYERS = "games/SET_ALL_PLAYERS";
const EXIT_GAME = "games/EXIT_GAME";
// Actions

export const actionSetCurrentGame = game => {
	const roundsObj = {};
	if (game.gameRounds) {
		game.gameRounds.forEach(round => (roundsObj[round.roundNumber] = round));
		game.gameRounds = roundsObj;
	}
	return {
		type: SET_CURRENT_GAME,
		payload: game
	};
};

export const actionExitGame = () => {
	return {
		type: EXIT_GAME
	};
};

export const actionStartGame = () => {
	return {
		type: START_GAME
	};
};

export const actionAddPlayer = player => {
	return {
		type: ADD_PLAYER,
		payload: player
	};
};

export const actionRemovePlayer = socketId => {
	return {
		type: REMOVE_PLAYER,
		payload: socketId
	};
};

export const actionSetPlayers = players => {
	return {
		type: SET_CURRENT_PLAYERS,
		payload: players
	};
};
// Thunks

export const thunkCreateGame = game => async dispatch => {
	const response = await csrfFetch(`/api/games`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(game)
	});

	const data = await response.json();
	dispatch(actionSetCurrentGame(data));
	return data;
};

export const thunkLoadGame = gameCode => async dispatch => {
	const response = await csrfFetch(`/api/games/${gameCode}`);
	if (response.ok) {
		const data = await response.json();
		dispatch(actionSetCurrentGame(data));
	} else {
		return response;
	}
};

export const thunkStartGame = gameCode => async dispatch => {
	const response = await csrfFetch(`/api/games/${gameCode}/start`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		}
	});

	if (response.ok) {
		// const data = await response.json();
		dispatch(actionStartGame());
	} else {
		return response;
	}
};

const initialState = {
	currentGame: null,
	currentPlayers: {}
};

const gamesReducer = (state = initialState, action) => {
	let newState;
	switch (action.type) {
		case SET_CURRENT_GAME:
			newState = { ...state };
			newState.currentGame = action.payload;
			return newState;
		case START_GAME:
			newState = { ...state };
			newState.currentGame.hasStarted = true;
			return newState;
		case ADD_PLAYER:
			newState = { ...state };
			newState.currentPlayers[action.payload.user.id] = action.payload;
			return newState;
		case REMOVE_PLAYER:
			newState = { ...state };
			const deleteKey = Object.keys(newState.currentPlayers).find(
				key => newState.currentPlayers[key].socketId === action.payload
			);
			if (deleteKey) {
				delete newState.currentPlayers[deleteKey];
			}
			return newState;
		case SET_CURRENT_PLAYERS:
			newState = { ...state };
			newState.currentPlayers = {
				...newState.currentPlayers,
				...action.payload
			};
			return newState;
		case EXIT_GAME:
			return {
				currentGame: null,
				currentPlayers: {}
			};
		default:
			return state;
	}
};

export default gamesReducer;
