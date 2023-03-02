import { csrfFetch } from "./csrf";
// Constants

const SET_CURRENT_GAME = "games/SET_CURRENT_GAME";
const ADD_PLAYER = "games/ADD_PLAYER";
const DISCONNECT_PLAYER = "games/DISCONNECT_PLAYER";
const RECONNECT_PLAYER = "games/RECONNECT_PLAYER";
const SET_SCORES = "games/SET_SCORES";
const SET_CURRENT_ROUND = "games/SET_CURRENT_ROUND";
const SET_GAME_SECTION = "games/SET_GAME_SECTION";
const ADD_GAME_DRAWING = "games/ADD_GAME_DRAWING";
const ADD_POINTS = "games/ADD_POINTS";
const SET_TIMESUP_TRUE = "games/SET_TIMESUP_TRUE";
const SET_TIMESUP_FALSE = "games/SET_TIMESUP_FALSE";
const SET_PLAYER_VOTED_FOR = "games/SET_PLAYER_VOTED_FOR";
const RESET_VOTES = "games/RESET_VOTES";
const RESET_GAME = "games/RESET_GAME";

// Actions

export const actionSetCurrentGame = game => {
	const roundsObj = {};
	if (game.gameRounds) {
		game.gameRounds.forEach(round => (roundsObj[round.roundNumber] = round));
		game.gameRounds = roundsObj;
	}
	return {
		type: SET_CURRENT_GAME,
		game
	};
};

export const actionAddPlayer = player => {
	return {
		type: ADD_PLAYER,
		player
	};
};

export const actionDisconnectPlayer = playerId => {
	return {
		type: DISCONNECT_PLAYER,
		playerId
	};
};

export const actionReconnectPlayer = playerId => {
	return {
		type: RECONNECT_PLAYER,
		playerId
	};
};

export const actionSetCurrentRound = roundNumber => {
	return {
		type: SET_CURRENT_ROUND,
		roundNumber
	};
};

export const actionSetGameSection = section => {
	return {
		type: SET_GAME_SECTION,
		section
	};
};

export const actionAddGameDrawing = drawing => {
	return {
		type: ADD_GAME_DRAWING,
		drawing
	};
};

export const actionSetScores = playerIdsArray => {
	const scores = {};
	playerIdsArray.forEach(playerId => (scores[playerId] = 0));
	return {
		type: SET_SCORES,
		scores
	};
};

export const actionAddPoints = playerId => {
	return {
		type: ADD_POINTS,
		playerId
	};
};

export const actionSetTimesUpTrue = () => {
	return {
		type: SET_TIMESUP_TRUE
	};
};
export const actionSetTimesUpFalse = () => {
	return {
		type: SET_TIMESUP_FALSE
	};
};

export const actionSetPlayerVotedFor = playerId => {
	return {
		type: SET_PLAYER_VOTED_FOR,
		playerId
	};
};

export const actionResetVotes = () => {
	return {
		type: RESET_VOTES
	};
};

export const actionResetGame = () => {
	return { type: RESET_GAME };
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
	if (response.ok) {
		const data = await response.json();
		dispatch(actionResetGame());
		dispatch(actionSetCurrentGame(data));
		return data;
	} else {
		return response;
	}
};

export const thunkLoadGame = gameCode => async dispatch => {
	const response = await csrfFetch(`/api/games/${gameCode}`);
	const data = await response.json();
	if (response.ok) {
		dispatch(actionResetGame());
		dispatch(actionSetCurrentGame(data));
	} else {
		return response;
	}
};

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

export const thunkAddGameDrawing = drawingData => async dispatch => {
	const response = await csrfFetch("/api/drawings", {
		method: "POST",
		body: drawingData,
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});

	const data = await response.json();
	dispatch(actionAddGameDrawing(data));
	return data;
};

export const thunkAddVote = drawingId => async () => {
	const response = await csrfFetch(`/api/drawings/${drawingId}/vote`, {
		method: "POST"
	});
	await response.json();
};

const initialState = {
	id: null,
	creatorId: null,
	code: null,
	numPlayers: null,
	timeLimit: null,
	numRounds: null,
	gameRounds: {},
	currentRound: 1,
	players: {},
	section: "lobby",
	scores: {},
	drawings: {},
	timesUp: false,
	playerVotedFor: null,
	voteCount: 0
};

const gameReducer = (state = initialState, action) => {
	let newState;
	switch (action.type) {
		case SET_CURRENT_GAME:
			const {
				id,
				code,
				numPlayers,
				timeLimit,
				numRounds,
				gameRounds,
				creatorId
			} = action.game;
			newState = {
				...state,
				id,
				creatorId,
				code,
				numPlayers,
				timeLimit,
				numRounds,
				gameRounds
			};
			return newState;
		case ADD_PLAYER:
			newState = { ...state };
			newState.players = {
				...newState.players,
				[action.player.id]: action.player
			};
			newState.scores[action.player.id] = 0;
			return newState;
		case DISCONNECT_PLAYER:
			newState = { ...state };
			newState.players[action.playerId].connected = false;
			return newState;
		case RECONNECT_PLAYER:
			newState = { ...state };
			newState.players[action.playerId].connected = true;
			return newState;
		case SET_SCORES:
			newState = { ...state };
			newState.scores = action.scores;
			return newState;
		case SET_CURRENT_ROUND:
			newState = { ...state };
			const newRound = newState.gameRounds[action.roundNumber];
			newState.currentRound = newRound;
			newState.drawings = {
				...newState.drawings,
				[newState.currentRound.id]: {}
			};
			return newState;
		case SET_GAME_SECTION:
			newState = { ...state };
			newState.section = action.section;
			newState.timesUp = false;
			return newState;
		case ADD_GAME_DRAWING:
			newState = { ...state };
			newState.drawings[action.drawing.roundId] = {
				...newState.drawings[action.drawing.roundId],
				[action.drawing.userId]: { ...action.drawing, votes: 0 }
			};
			return newState;
		case ADD_POINTS:
			newState = { ...state };
			newState.scores[action.playerId] += 100;
			newState.drawings[newState.currentRound.id][action.playerId].votes += 1;
			newState.voteCount += 1;
			return newState;
		case SET_TIMESUP_TRUE:
			newState = { ...state };
			newState.timesUp = true;
			return newState;
		case SET_TIMESUP_FALSE:
			newState = { ...state };
			newState.timesUp = false;
			return newState;
		case SET_PLAYER_VOTED_FOR:
			newState = { ...state };
			newState.playerVotedFor = action.playerId;
			return newState;
		case RESET_VOTES:
			newState = { ...state };
			newState.voteCount = 0;
			return newState;
		case RESET_GAME:
			return initialState;
		default:
			return state;
	}
};

export default gameReducer;
