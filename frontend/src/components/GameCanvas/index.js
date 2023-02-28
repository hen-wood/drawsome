import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkAddDrawing } from "../../store/drawings";
import isCanvasBlank from "../../utils/isCanvasBlank";
import "./GameCanvas.css";

export default function GameCanvas({ prompt }) {
	const user = useSelector(state => state.session.user);
	const dispatch = useDispatch();
	const history = useHistory();
	const canvasRef = useRef(null);
	const contextRef = useRef(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [brushSize, setBrushSize] = useState(5);

	const [errors, setErrors] = useState({});
	const [color, setColor] = useState("black");

	useEffect(() => {
		if (!user) {
			history.push("/login");
		}
	}, [user]);

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

	const handleColorClick = selectedColor => {
		setColor(selectedColor);
		contextRef.current.strokeStyle = selectedColor;
	};

	const startDrawing = e => {
		setErrors(errs => {
			const canvas = false;
			return { ...errs, canvas };
		});
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
		// const newErrors = {
		// 	canvas: isCanvasBlank(canvasRef),
		// 	title: title.length < 1
		// };
		// if (newErrors.canvas || newErrors.title) {
		// 	setErrors(newErrors);
		// 	return;
		// }

		const dataURL = canvasRef.current.toDataURL("image/png");
		const formData = new FormData();
		formData.append("image", dataURL);
		formData.append("title", prompt);

		dispatch(thunkAddDrawing(formData)).then(() => {
			history.push("/user-drawings");
		});
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
			<h1 className={errors.canvas ? "canvas-error" : "canvas-error-hidden"}>
				Canvas cannot be blank
			</h1>
			{/* <button onClick={handleSaveDrawing}>Save Drawing</button> */}
		</div>
	);
}
