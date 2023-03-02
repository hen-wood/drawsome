export const handleSaveRoundDrawing = async (
	canvasRef,
	title,
	dispatch,
	thunk,
	setGameSection
) => {
	const dataURL = canvasRef.current.toDataURL("image/png");
	const formData = new FormData();
	formData.append("image", dataURL);
	formData.append("title", title);

	dispatch(thunk(formData)).then(data => {
		return data;
	});
};
