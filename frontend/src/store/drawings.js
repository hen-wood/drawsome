import { csrfFetch } from "./csrf";

const SET_USER_DRAWINGS = "drawings/SET_USER_DRAWINGS";
const ADD_DRAWING = "drawings/ADD_DRAWING";
const EDIT_DRAWING_TITLE = "drawings/EDIT_DRAWING_TITLE";
const DELETE_DRAWING = "drawings/DELETE_DRAWING";

// Actions

const actionSetUserDrawings = drawings => {
	const drawingsObj = {};
	drawings.forEach(drawing => (drawingsObj[drawing.id] = drawing));
	return {
		type: SET_USER_DRAWINGS,
		payload: drawingsObj
	};
};

export const actionAddDrawing = drawing => {
	return {
		type: ADD_DRAWING,
		payload: drawing
	};
};

const actionEditDrawingTitle = (drawingId, newTitle) => {
	return {
		type: EDIT_DRAWING_TITLE,
		payload: { drawingId, newTitle }
	};
};

const actionDeleteDrawing = drawingId => {
	return {
		type: DELETE_DRAWING,
		payload: drawingId
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

export const thunkEditDrawingTitle =
	(drawingId, newTitle) => async dispatch => {
		const res = await csrfFetch(`/api/drawings/${drawingId}/edit`, {
			method: "PUT",
			body: JSON.stringify({
				newTitle
			})
		});

		const data = await res.json();
		dispatch(actionEditDrawingTitle(drawingId, newTitle));
		return data;
	};

export const thunkDeleteDrawing = drawingId => async dispatch => {
	const res = await csrfFetch(`/api/drawings/${drawingId}/delete`, {
		method: "DELETE"
	});

	const data = await res.json();
	dispatch(actionDeleteDrawing(drawingId));
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
		case EDIT_DRAWING_TITLE:
			newState = { ...state };
			newState.allDrawings[action.payload.drawingId].title =
				action.payload.newTitle;
			return newState;
		case DELETE_DRAWING:
			newState = { ...state };
			delete newState.allDrawings[action.payload];
			return newState;
		default:
			return state;
	}
};

export default drawingReducer;
