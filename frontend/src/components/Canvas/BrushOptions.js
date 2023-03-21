import { colorArray, sizesArray } from "./optionArrs";

export default function BrushOptions({
	color,
	setColor,
	setShowBrushOptions,
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
				{sizesArray.map((size, i) => {
					return (
						<div
							className="size-option"
							key={i}
							onClick={() => {
								setBrushSize(size);
							}}
						>
							<div
								style={{
									height: `${size * 2}px`,
									width: `${size * 2}px`,
									borderRadius: "50%",
									backgroundColor: color,
									boxShadow: "0px 5px 10px 0px #00000080"
								}}
							></div>
						</div>
					);
				})}
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
