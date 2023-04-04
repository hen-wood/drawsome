import { useEffect, useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import loadingGif from "../../images/loading.gif";
import {
	thunkEditDrawingTitle,
	thunkDeleteDrawing
} from "../../store/drawings";
import OpenDrawing from "../PastGames/OpenDrawing";
import "./UserDrawings.css";

export default function UserDrawings() {
	const dispatch = useDispatch();
	const drawingsObj = useSelector(state => state.drawings.allDrawings);
	const galleryRef = useRef(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [editId, setEditId] = useState(null);
	const [deleteId, setDeleteId] = useState(null);
	const [editedTitle, setEditedTitle] = useState("");
	const [drawings, setDrawings] = useState(drawingsObj);
	const [drawingOpen, setDrawingOpen] = useState(false);
	const [openDrawingTitle, setOpenDrawingTitle] = useState("");
	const [openDrawingUrl, setOpenDrawingUrl] = useState("");

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
		dispatch(thunkDeleteDrawing(drawingId)).then(() => {
			const updatedDrawings = { ...drawings };
			delete updatedDrawings[drawingId];
			setDrawings(updatedDrawings);
			setDeleteId(null);
		});
	};

	const handleOpenDrawing = (url, title) => {
		setOpenDrawingTitle(title);
		setOpenDrawingUrl(url);
		setDrawingOpen(true);
	};

	return isLoaded ? (
		<div
			className={
				Object.values(drawings).length
					? "user-drawings-container"
					: "no-drawings-container"
			}
			ref={galleryRef}
		>
			{drawingOpen && (
				<OpenDrawing
					setDrawingOpen={setDrawingOpen}
					drawingUrl={openDrawingUrl}
					title={openDrawingTitle}
				/>
			)}
			{Object.values(drawings).length > 0 ? (
				Object.values(drawings).map(drawing => {
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
								onClick={() => setDeleteId(drawing.id)}
							></i>
							{deleteId === drawing.id && (
								<div className="delete-warning">
									<p className="delete-warning-title">Delete drawing?</p>
									<div className="delete-warning-btns">
										<button
											className="warning-delete-button"
											onClick={() => {
												handleDelete(drawing.id);
											}}
										>
											Delete it!
										</button>
										<button
											className="warning-cancel-button"
											onClick={() => setDeleteId(null)}
										>
											Nevermind
										</button>
									</div>
								</div>
							)}
							<img
								src={drawing.drawingUrl}
								alt={drawing.title}
								onClick={() => handleOpenDrawing(drawing.drawingUrl)}
							/>
						</div>
					);
				})
			) : (
				<h1 className="no-drawings-title">
					No Drawings yet 😭 Click <Link to="/draw">here</Link> to make one!
				</h1>
			)}
		</div>
	) : (
		<div className="user-drawings-container" ref={galleryRef}>
			<img src={loadingGif} alt="loading" />
		</div>
	);
}
