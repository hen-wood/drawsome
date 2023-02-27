import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkAddDrawing } from "../../store/drawings";
import isCanvasBlank from "../../utils/isCanvasBlank";
import "./SoloCanvas.css";

export default function SoloCanvas() {
	const user = useSelector(state => state.session.user);
	const dispatch = useDispatch();
	const history = useHistory();
	const canvasRef = useRef(null);
	const contextRef = useRef(null);
	const [disableButton, setDisableButton] = useState(false);
	const [isDrawing, setIsDrawing] = useState(false);
	const [title, setTitle] = useState("");

	const [errors, setErrors] = useState({});
	const [color, setColor] = useState("black");

	useEffect(() => {
		if (!user) {
			history.push("/login");
		}
	}, [user]);

	useEffect(() => {
		const canvas = canvasRef.current;
		canvas.width = 600;
		canvas.height = 400;

		const context = canvas.getContext("2d");
		context.lineCap = "round";
		context.strokeStyle = color;
		context.lineWidth = 5;
		context.fillStyle = "white";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.canvas.style.touchAction = "none";
		contextRef.current = context;
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
		setDisableButton(true);
		const newErrors = {
			canvas: isCanvasBlank(canvasRef),
			title: title.length < 1
		};
		if (newErrors.canvas || newErrors.title) {
			setErrors(newErrors);
			setDisableButton(false);
			return;
		}

		const dataURL = canvasRef.current.toDataURL("image/png");
		const formData = new FormData();
		formData.append("image", dataURL);
		formData.append("title", title);

		dispatch(thunkAddDrawing(formData)).then(() => {
			history.push("/user-drawings");
			setDisableButton(false);
		});
	};

	return (
		<div id="canvas-container">
			<input
				type="text"
				placeholder={
					errors.title
						? "Please enter a title"
						: "Enter a title for your drawing"
				}
				className={errors.title ? "input-errors" : ""}
				onChange={e => setTitle(e.target.value)}
			></input>
			<canvas
				ref={canvasRef}
				id="canvas"
				onMouseDown={startDrawing}
				onMouseUp={endDrawing}
				onMouseMove={draw}
				onPointerDown={startDrawing}
				onPointerUp={endDrawing}
				onPointerMove={draw}
			></canvas>
			<div id="tool-kit">
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
			<button onClick={handleSaveDrawing} disabled={disableButton}>
				Save Drawing
			</button>
		</div>
	);
}
