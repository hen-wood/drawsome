export default function isCanvasBlank(canvasRef) {
	const context = canvasRef.current.getContext("2d");
	const pixelData = context.getImageData(
		0,
		0,
		canvasRef.current.width,
		canvasRef.current.height
	).data;

	return !pixelData.some(pixel => pixel !== 255);
}
