import { useSelector } from "react-redux";
import "./UserDrawings.css";

export default function UserDrawings() {
	const drawings = useSelector(state => state.drawings.allDrawings);
	return (
		<div id="user-drawings-container">
			{Object.values(drawings).map(drawing => {
				return (
					<div key={drawing.id} className="indiv-drawing-container">
						<img src={drawing.drawingUrl} alt={drawing.title} />
					</div>
				);
			})}
		</div>
	);
}
