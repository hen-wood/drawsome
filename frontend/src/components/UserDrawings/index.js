import { useEffect, useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { thunkEditDrawingTitle } from "../../store/drawings";
import "./UserDrawings.css";

export default function UserDrawings() {
	const dispatch = useDispatch();
	const drawingsObj = useSelector(state => state.drawings.allDrawings);
	const galleryRef = useRef(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [editId, setEditId] = useState(null);
	const [editedTitle, setEditedTitle] = useState("");
	const [drawings, setDrawings] = useState(drawingsObj);

	useEffect(() => {
		setDrawings(drawingsObj);
		setIsLoaded(true);
	}, [drawingsObj]);

	const handleEditOpen = drawing => {
		setEditId(drawing.id);
		setEditedTitle(drawing.title);
	};

	const handleEditClose = () => {
		setEditId(null);
		setEditedTitle("");
	};

	const handleEditSubmit = (e, drawingId) => {
		e.preventDefault();
		const updatedDrawings = { ...drawings };

		updatedDrawings[drawingId].title = editedTitle;
		setDrawings(updatedDrawings);

		dispatch(thunkEditDrawingTitle(drawingId, editedTitle));
		setEditId(null);
		setEditedTitle("");
	};

	const handleDelete = drawingId => {
		console.log(drawingId);
	};

	return isLoaded ? (
		<div id="user-drawings-container" ref={galleryRef}>
			{Object.values(drawings).map(drawing => {
				return (
					<div key={drawing.id} className="indiv-drawing-container">
						{editId === drawing.id ? (
							<form
								className="edit-title-form"
								onSubmit={e => handleEditSubmit(e, drawing.id)}
							>
								<input
									className="edit-title-field"
									type="text"
									value={editedTitle}
									onChange={e => setEditedTitle(e.target.value)}
									autoFocus
								/>
								<i
									className="fa-solid fa-circle-xmark edit-close"
									onClick={handleEditClose}
								></i>
							</form>
						) : (
							<h2
								className="drawing-title"
								onClick={e => handleEditOpen(drawing)}
							>{`"${drawing.title}"`}</h2>
						)}
						<i
							className="fa-solid fa-trash-can delete-button"
							onClick={() => handleDelete(drawing.id)}
						></i>
						<img src={drawing.drawingUrl} alt={drawing.title} />
					</div>
				);
			})}
		</div>
	) : (
		<div id="user-drawings-container" ref={galleryRef}>
			<h1>Loading drawings...</h1>
		</div>
	);
}
