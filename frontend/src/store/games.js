// Constants

import { csrfFetch } from "./csrf";

const SET_CURRENT_GAME = "games/SET_CURRENT_GAME";
const UPDATE_CURRENT_GAME = "games/UPDATE_CURRENT_GAME";
// Actions

export const actionSetCurrentGame = game => {
	return {
		type: SET_CURRENT_GAME,
		payload: game
	};
};

// Thunks

export const thunkCreateGame = game => async dispatch => {
	const response = csrfFetch(`/api/games`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(game)
	});

	const data = await response;
	dispatch(actionSetCurrentGame(data));
	return data;
};

const initialState = {
	currentGame: null
};

const gamesReducer = (state = initialState, action) => {
	let newState;
	switch (action.type) {
		case SET_CURRENT_GAME:
			newState = { ...state };
			newState.currentGame = action.payload;
			return newState;
		default:
			return state;
	}
};

export default gamesReducer;
