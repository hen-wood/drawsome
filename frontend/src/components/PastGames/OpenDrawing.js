import { useRef } from "react";
import "./OpenDrawing.css";
export default function OpenDrawing({ setDrawingOpen, drawingUrl, title }) {
	const drawingRef = useRef(null);
	const xButton = useRef(null);

	const handleCloseDrawing = e => {
		if (e.target === xButton.current || e.target !== drawingRef.current)
			setDrawingOpen(false);
	};
	return (
		<div id="open-drawing-outer" onClick={handleCloseDrawing}>
			<div id="open-drawing-inner">
				<i
					ref={xButton}
					className="fa-solid fa-xmark close-drawing"
					onClick={handleCloseDrawing}
				></i>
				<img ref={drawingRef} src={drawingUrl} alt={title} />
			</div>
		</div>
	);
}
