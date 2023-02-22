import { useEffect, useRef, useState } from "react";
import "./DrawingTest.css";
import { csrfFetch } from "../../store/csrf";

export default function DrawingTest() {
	const canvasRef = useRef(null);
	const contextRef = useRef(null);
	const [isDrawing, setIsDrawing] = useState(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		canvas.width = 400;
		canvas.height = 400;

		const context = canvas.getContext("2d");
		context.lineCap = "round";
		context.strokeStyle = "black";
		context.lineWidth = 5;
		context.fillStyle = "white";
		context.fillRect(0, 0, canvas.width, canvas.height);
		contextRef.current = context;
	}, []);

	const startDrawing = e => {
		const { offsetX, offsetY } = e.nativeEvent;
		contextRef.current.beginPath();
		contextRef.current.moveTo(offsetX, offsetY);
		setIsDrawing(true);
	};

	const draw = e => {
		if (!isDrawing) return;
		const { offsetX, offsetY } = e.nativeEvent;
		contextRef.current.lineTo(offsetX, offsetY);
		contextRef.current.stroke();
	};

	const endDrawing = () => {
		contextRef.current.closePath();
		setIsDrawing(false);
	};

	const handleSaveDrawing = async () => {
		// create a data URL for the canvas content
		const dataURL = canvasRef.current.toDataURL("image/png");
		const formData = new FormData();
		formData.append("image", dataURL);

		const res = await csrfFetch("/api/drawings", {
			method: "POST",
			body: formData,
			headers: {
				"Content-Type": "multipart/form-data"
			}
		});

		const data = await res.json();
		return data;
	};

	return (
		<div id="test-outer">
			<canvas
				ref={canvasRef}
				id="canvas"
				onMouseDown={startDrawing}
				onMouseUp={endDrawing}
				onMouseMove={draw}
			></canvas>
			<button onClick={handleSaveDrawing}>Save Drawing</button>
		</div>
	);
}
