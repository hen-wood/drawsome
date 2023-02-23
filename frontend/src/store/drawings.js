import { csrfFetch } from "./csrf";

const SET_USER_DRAWINGS = "drawings/SET_USER_DRAWINGS";
const ADD_DRAWING = "drawings/ADD_DRAWING";

// Actions

const actionSetUserDrawings = drawings => {
	const drawingsObj = {};
	drawings.forEach(drawing => (drawingsObj[drawing.id] = drawing));
	return {
		type: SET_USER_DRAWINGS,
		payload: drawingsObj
	};
};

const actionAddDrawing = drawing => {
	return {
		type: ADD_DRAWING,
		payload: drawing
	};
};

// Thunks

export const thunkGetUserDrawings = userId => async dispatch => {
	const response = await csrfFetch(`/api/users/${userId}/drawings`);
	const data = await response.json();
	dispatch(actionSetUserDrawings(data));
	return response;
};

export const thunkAddDrawing = formData => async dispatch => {
	const res = await csrfFetch("/api/drawings", {
		method: "POST",
		body: formData,
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});

	const data = await res.json();
	dispatch(actionAddDrawing(data));
	return data;
};

const initialState = {
	allDrawings: {},
	singleDrawing: {}
};

const drawingReducer = (state = initialState, action) => {
	let newState;
	switch (action.type) {
		case SET_USER_DRAWINGS:
			newState = { ...state };
			newState.allDrawings = action.payload;
			return newState;
		case ADD_DRAWING:
			newState = { ...state };
			newState.allDrawings = {
				...newState.allDrawings,
				[action.payload.id]: action.payload
			};
			return newState;
		default:
			return state;
	}
};

export default drawingReducer;
