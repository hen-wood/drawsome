import { solidColors, lightColors } from "./optionArrs";

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
				{solidColors.map((clr, i) => {
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
			<div className="color-options-container">
				{lightColors.map((clr, i) => {
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
