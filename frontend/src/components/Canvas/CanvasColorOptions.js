import { colorArray } from "./optionArrs";

export default function CanvasColorOptions({
	setBgColor,
	setShowCanvasColors
}) {
	return (
		<div className="options-modal">
			<i
				className="fa-solid fa-xmark close-options-button"
				onClick={() => setShowCanvasColors(false)}
			></i>
			<h2 className="options-modal-title">Select canvas color</h2>
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
								setBgColor(clr);
							}}
						></button>
					);
				})}
			</div>
		</div>
	);
}
