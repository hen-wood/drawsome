import { useState } from "react";
import { colorArray, sizesArray } from "./optionArrs";

export default function BrushOptions({
	color,
	setColor,
	setShowBrushOptions,
	brushSize,
	setBrushSize
}) {
	return (
		<div className="options-modal">
			<i
				className="fa-solid fa-xmark close-options-button"
				onClick={() => setShowBrushOptions(false)}
			></i>
			<h2 className="options-modal-title">Select brush size and color</h2>
			<div className="size-options-container">
				<button
					onMouseDown={() => {
						if (brushSize > 3) setBrushSize(prev => prev - 2);
					}}
				>
					<i className="fa-solid fa-minus"></i>
				</button>
				<div
					style={{
						height: `${brushSize * 2}px`,
						width: `${brushSize * 2}px`,
						borderRadius: "50%",
						border: "1px solid white",
						backgroundColor: color
					}}
				></div>
				<button
					onMouseDown={() => {
						if (brushSize < 48) setBrushSize(prev => prev + 2);
					}}
				>
					<i className="fa-solid fa-plus"></i>
				</button>
			</div>
			<div className="color-options-container">
				{colorArray.map((clr, i) => {
					return (
						<button
							className="color-option"
							style={{
								backgroundColor: clr
							}}
							key={i}
							onClick={() => {
								setColor(clr);
							}}
						></button>
					);
				})}
			</div>
		</div>
	);
}
