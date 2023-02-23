import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import "./Forms.css";

export default function CreateGame() {
	const dispatch = useDispatch();
	const history = useHistory();
	const user = useSelector(state => state.session.user);
	const [gameCode, setGameCode] = useState("");
	const [errors, setErrors] = useState({});
	const [backendError, setBackendError] = useState("");

	const handleLogin = e => {
		e.preventDefault();
	};

	return (
		<div id="form-container">
			<h1>Create a Drawsome Game</h1>
			{backendError && <p className="backend-errors">{backendError}</p>}
			<form onSubmit={handleLogin}>
				<input
					className={errors.gameCode ? "input-errors" : ""}
					type="text"
					value={gameCode}
					placeholder={errors.gameCode || "enter game code"}
					onChange={e => setGameCode(e.target.value)}
					onFocus={() =>
						setErrors(errs => {
							const gameCode = null;
							return { ...errs, gameCode };
						})
					}
				/>
				<button type="submit">Enter Game</button>
			</form>
			<p>
				Join an existing game <Link to="/join-game">here</Link>
			</p>
		</div>
	);
}
