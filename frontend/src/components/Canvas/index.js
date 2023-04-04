import { useState } from "react";
import CanvasDraw from "react-canvas-draw";
import CanvasToolKit from "./CanvasToolKit";
import "./Canvas.css";
import CanvasColorOptions from "./CanvasColorOptions";
import BrushOptions from "./BrushOptions";

export default function Canvas({
	canvasRef,
	isGameCanvas,
	bgColor,
	setBgColor,
	title,
	setTitle
}) {
	const [showBrushOptions, setShowBrushOptions] = useState(false);
	const [showCanvasColors, setShowCanvasColors] = useState(false);

	const [titleError, setTitleError] = useState("");

	const [color, setColor] = useState("black");
	const [brushSize, setBrushSize] = useState(3);

	return (
		<div className="canvas-container">
			<div className="canvas-title">
				{isGameCanvas ? (
					<h1 className="round-prompt-title">{`"${title}"`}</h1>
				) : (
					<input
						type="text"
						placeholder={
							titleError.length
								? "Please enter a title"
								: "Enter a title for your drawing"
						}
						className={
							titleError.length ? "title-input input-errors" : "title-input"
						}
						onChange={e => {
							if (e.target.value.length <= 30) {
								setTitle(e.target.value);
							} else {
								e.target.value = e.target.value.slice(0, 31);
							}
						}}
						onFocus={() => setTitleError("")}
					></input>
				)}
			</div>
			<div className="canvas-inner-container">
				<div
					className="canvas-wrapper"
					onMouseDown={() => {
						setShowCanvasColors(false);
						setShowBrushOptions(false);
					}}
				>
					<CanvasDraw
						ref={canvasRef}
						hideGrid={true}
						brushColor={color}
						backgroundColor={bgColor}
						brushRadius={brushSize}
						lazyRadius={0}
						gridSizeX={0}
						gridSizeY={0}
						catenaryColor={color}
						style={{ width: "100%", height: "100%", borderRadius: "8px" }}
					/>
				</div>
				{showBrushOptions && (
					<BrushOptions
						color={color}
						setColor={setColor}
						setShowBrushOptions={setShowBrushOptions}
						brushSize={brushSize}
						setBrushSize={setBrushSize}
					/>
				)}
				{showCanvasColors && (
					<CanvasColorOptions
						setBgColor={setBgColor}
						setShowCanvasColors={setShowCanvasColors}
					/>
				)}
				<CanvasToolKit
					canvasRef={canvasRef}
					showBrushOptions={showBrushOptions}
					setShowBrushOptions={setShowBrushOptions}
					showCanvasColors={showCanvasColors}
					setShowCanvasColors={setShowCanvasColors}
					isGameCanvas={isGameCanvas}
					title={title}
					setTitleError={setTitleError}
					bgColor={bgColor}
				/>
			</div>
		</div>
	);
}
