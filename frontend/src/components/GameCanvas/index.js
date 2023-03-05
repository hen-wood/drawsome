import { useEffect, useRef, useState } from "react";
import "./GameCanvas.css";

export default function GameCanvas({ prompt, canvasRef }) {
	const contextRef = useRef(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [brushSize, setBrushSize] = useState(5);
	const [color, setColor] = useState("black");

	useEffect(() => {
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			canvas.width = 600;
			canvas.height = 400;

			const context = canvas.getContext("2d");
			context.lineCap = "round";
			context.strokeStyle = color;
			context.lineWidth = brushSize;
			context.fillStyle = "white";
			context.fillRect(0, 0, canvas.width, canvas.height);
			context.canvas.style.touchAction = "none";
			contextRef.current = context;
		}
	}, []);

	const clearCanvas = () => {
		contextRef.current.fillRect(
			0,
			0,
			canvasRef.current.width,
			canvasRef.current.height
		);
	};

	const handleColorClick = selectedColor => {
		setColor(selectedColor);
		contextRef.current.strokeStyle = selectedColor;
	};

	const handleBrushClick = size => {
		setBrushSize(size);
		contextRef.current.lineWidth = size;
	};

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

	return (
		<div id="game-canvas-container">
			<h2 id="round-prompt">{`"${prompt}"`}</h2>
			<canvas
				ref={canvasRef}
				id="game-canvas"
				onMouseDown={startDrawing}
				onMouseUp={endDrawing}
				onMouseMove={draw}
				onPointerDown={startDrawing}
				onPointerUp={endDrawing}
				onPointerMove={draw}
			></canvas>
			<div id="game-tool-kit">
				<div id="tools">
					<i
						onClick={() => handleBrushClick(5)}
						className={
							brushSize === 5
								? "fa-solid fa-paintbrush selected"
								: "fa-solid fa-paintbrush"
						}
					></i>
					<i
						onClick={() => handleBrushClick(2)}
						className={
							brushSize === 2
								? "fa-solid fa-pencil selected"
								: "fa-solid fa-pencil"
						}
					></i>
					<i
						id="black-color-selector"
						className={
							color === "black"
								? "fa-solid fa-square selected"
								: "fa-solid fa-square"
						}
						onClick={() => handleColorClick("black")}
					></i>
					<i
						id="white-color-selector"
						className={
							color === "white"
								? "fa-solid fa-square selected"
								: "fa-solid fa-square"
						}
						onClick={() => handleColorClick("white")}
					></i>
					<i
						id="red-color-selector"
						className={
							color === "red"
								? "fa-solid fa-square selected"
								: "fa-solid fa-square"
						}
						onClick={() => handleColorClick("red")}
					></i>
					<i
						id="orange-color-selector"
						className={
							color === "orange"
								? "fa-solid fa-square selected"
								: "fa-solid fa-square"
						}
						onClick={() => handleColorClick("orange")}
					></i>
					<i
						id="yellow-color-selector"
						className={
							color === "yellow"
								? "fa-solid fa-square selected"
								: "fa-solid fa-square"
						}
						onClick={() => handleColorClick("yellow")}
					></i>
					<i
						id="green-color-selector"
						className={
							color === "green"
								? "fa-solid fa-square selected"
								: "fa-solid fa-square"
						}
						onClick={() => handleColorClick("green")}
					></i>
					<i
						id="blue-color-selector"
						className={
							color === "blue"
								? "fa-solid fa-square selected"
								: "fa-solid fa-square"
						}
						onClick={() => handleColorClick("blue")}
					></i>
				</div>
				<i
					className="fa-solid fa-trash-can clear-drawing"
					onClick={clearCanvas}
				></i>
			</div>
		</div>
	);
}
