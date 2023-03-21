import { useRef, useState } from "react";

import Canvas from "../Canvas";

export default function SoloDraw() {
	const canvasRef = useRef(null);

	const [bgColor, setBgColor] = useState("#fff");
	const [title, setTitle] = useState("");

	return (
		<>
			<Canvas
				canvasRef={canvasRef}
				isGameCanvas={false}
				title={title}
				bgColor={bgColor}
				setBgColor={setBgColor}
				setTitle={setTitle}
			/>
		</>
	);
}
