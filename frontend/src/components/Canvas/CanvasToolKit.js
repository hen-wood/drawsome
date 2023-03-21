import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { thunkAddDrawing } from "../../store/drawings";

export default function CanvasToolKit({
	canvasRef,
	showBrushOptions,
	setShowBrushOptions,
	showCanvasColors,
	setShowCanvasColors,
	isGameCanvas,
	title,
	setTitleError,
	bgColor
}) {
	const dispatch = useDispatch();
	const history = useHistory();
	const handleUndo = () => {
		canvasRef.current.undo();
	};
	const handleClearCanvas = () => {
		canvasRef.current.eraseAll();
	};

	const handleSaveSoloDrawing = () => {
		if (!title.length) {
			setTitleError("Please enter a title");
			return;
		}
		const dataURL = canvasRef.current.getDataURL("image/png", false, bgColor);

		const formData = new FormData();

		formData.append("image", dataURL);
		formData.append("title", title);
		dispatch(thunkAddDrawing(formData)).then(() => {
			history.push("user-drawings");
		});
	};

	return (
		<div className="canvas-toolkit">
			<button
				className={
					showBrushOptions
						? "toolkit-option-selected toolkit-option"
						: "toolkit-option"
				}
				title="Brush size and color options"
				onClick={() => {
					setShowCanvasColors(false);
					setShowBrushOptions(!showBrushOptions);
				}}
			>
				<i className="fa-solid fa-brush"></i>
			</button>
			<button
				className={
					showCanvasColors
						? "toolkit-option-selected toolkit-option"
						: "toolkit-option"
				}
				title="Canvas color options"
				onClick={() => {
					setShowBrushOptions(false);
					setShowCanvasColors(!showCanvasColors);
				}}
			>
				<i className="fa-solid fa-image"></i>
			</button>
			<button title="Undo" onClick={handleUndo} className="toolkit-option">
				<i className="fa-solid fa-rotate-left"></i>
			</button>
			<button
				title="Clear Canvas"
				onClick={handleClearCanvas}
				className="toolkit-option"
			>
				<i className="fa-solid fa-trash-can"></i>
			</button>
			{!isGameCanvas && (
				<button
					onClick={() => handleSaveSoloDrawing()}
					className="toolkit-option"
				>
					<i title="Save drawing" className="fa-solid fa-floppy-disk"></i>
				</button>
			)}
		</div>
	);
}
