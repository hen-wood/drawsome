import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export default function JoinGame() {
	const user = useSelector(state => state.session.user);
	const history = useHistory();
	useEffect(() => {
		if (!user) {
			history.push("/login");
		}
	}, [user]);

	return (
		<div>
			<form>
				<h1>Hello from join game</h1>
			</form>
		</div>
	);
}
