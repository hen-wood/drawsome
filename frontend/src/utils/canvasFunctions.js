export const startDrawing = (e, setErrors, contextRef, setIsDrawing) => {
	setErrors(errs => {
		const canvas = false;
		return { ...errs, canvas };
	});
	const { offsetX, offsetY } = e.nativeEvent;
	contextRef.current.beginPath();
	contextRef.current.moveTo(offsetX, offsetY);
	setIsDrawing(true);
};

export const draw = (e, isDrawing, contextRef) => {
	if (!isDrawing) return;
	const { offsetX, offsetY } = e.nativeEvent;
	contextRef.current.lineTo(offsetX, offsetY);
	contextRef.current.stroke();
};

export const endDrawing = (contextRef, setIsDrawing) => {
	contextRef.current.closePath();
	setIsDrawing(false);
};

export function isCanvasBlank(canvasRef) {
	const context = canvasRef.current.getContext("2d");
	const pixelData = context.getImageData(
		0,
		0,
		canvasRef.current.width,
		canvasRef.current.height
	).data;

	return !pixelData.some(pixel => pixel !== 255);
}

export const handleSaveDrawing = async (
	prompt,
	autoSubmit,
	contextRef,
	canvasRef,
	dispatch,
	thunk,
	setError,
	setDrawingSubmitted
) => {
	if (!autoSubmit && isCanvasBlank(contextRef)) {
		setError("😡 You should probably draw something...");
		return;
	}

	const dataURL = canvasRef.current.toDataURL("image/png");
	const formData = new FormData();
	formData.append("image", dataURL);
	formData.append("title", prompt);

	dispatch(thunk(formData)).then(() => {
		setDrawingSubmitted(true);
	});
};
