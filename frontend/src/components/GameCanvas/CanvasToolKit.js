export default function CanvasToolKit({
	contextRef,
	selectedColor,
	setSelectedColor
}) {
	const colors = ["black", "white", "red", "orange", "yellow", "green", "blue"];

	const handleColorClick = color => {
		setSelectedColor(color);
		contextRef.current.strokeStyle = color;
	};

	return contextRef && selectedColor ? (
		<div id="tool-kit">
			{colors.map(color => {
				return (
					<i
						id="black-color-selector"
						className={
							selectedColor === color
								? "fa-solid fa-square selected"
								: "fa-solid fa-square"
						}
						onClick={() => handleColorClick(color)}
					></i>
				);
			})}
		</div>
	) : (
		<div id="tool-kit">
			<h1>Loading...</h1>
		</div>
	);
}
