import { useEffect } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import "./UserDrawings.css";

export default function UserDrawings() {
	const drawings = useSelector(state => state.drawings.allDrawings);
	const galleryRef = useRef(null);

	useEffect(() => {
		galleryRef.current.scrollTop = galleryRef.current.scrollHeight;
	}, [drawings]);

	return (
		<div id="user-drawings-container" ref={galleryRef}>
			{Object.values(drawings).map(drawing => {
				return (
					<div key={drawing.id} className="indiv-drawing-container">
						<h2 className="drawing-title">{`"${drawing.title}"`}</h2>
						<img src={drawing.drawingUrl} alt={drawing.title} />
					</div>
				);
			})}
		</div>
	);
}
