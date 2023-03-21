import { useRef, useState } from "react";

import Canvas from "../Canvas";

export default function SoloDraw() {
	const canvasRef = useRef(null);

	return (
		<div className="canvas-container">
			<Canvas canvasRef={canvasRef} isGameCanvas={false} />
		</div>
	);
}
