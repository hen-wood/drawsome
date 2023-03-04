import { csrfFetch } from "./csrf";
// Constants
const ADD_FINISHED_GAME = "games/ADD_FINISHED_GAME";
const RESET_GAME = "games/RESET_GAME";
// Actions
export const actionAddPastGame = game => {
	return {
		type: ADD_FINISHED_GAME,
		game
	};
};

// Thunks

export const thunkStartGame = gameId => async dispatch => {
	const response = await csrfFetch(`/api/games/${gameId}/start`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		}
	});

	if (response.ok) {
		const startedGame = await response.json();
		return startedGame;
	} else {
		return response;
	}
};

export const thunkEndGame = gameId => async dispatch => {
	const response = await csrfFetch(`/api/games/${gameId}/end`, {
		method: "PUT"
	});
	if (response.ok) {
		const endedGame = await response.json();
		dispatch(actionAddPastGame(endedGame));
		return endedGame;
	} else {
		return response;
	}
};

export const thunkAddVote = drawingId => async () => {
	const response = await csrfFetch(`/api/drawings/${drawingId}/vote`, {
		method: "POST"
	});
	await response.json();
};

const initialState = {
	pastGames: {},
	lastGame: {}
};

const gameReducer = (state = initialState, action) => {
	let newState;
	switch (action.type) {
		case ADD_FINISHED_GAME:
			newState = {
				...state,
				pastGames: { [action.game.id]: action.game },
				lastGame: action.game
			};
			return newState;
		default:
			return state;
	}
};

export default gameReducer;
