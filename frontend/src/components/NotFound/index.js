import { Link } from "react-router-dom";
import notFound from "../../images/page-not-found.png";

import "./NotFound.css";

export default function NotFound() {
	return (
		<div className="not-found-div">
			<h2>Page not found...</h2>
			<Link to="/">Back to home page</Link>
			<img className="not-found-image" src={notFound} alt="sad man" />
		</div>
	);
}
