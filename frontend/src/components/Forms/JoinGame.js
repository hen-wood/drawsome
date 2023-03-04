import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { csrfFetch } from "../../store/csrf";
import { setLocalFromObj } from "../Game/utils/localFunctions";
import { thunkLoadGame } from "../../store/games";

import "./Forms.css";

export default function JoinGame() {
	// const dispatch = useDispatch();
	const history = useHistory();
	const [gameCode, setGameCode] = useState("");
	const [error, setError] = useState("");

	const handleJoinGame = async e => {
		e.preventDefault();
		if (gameCode.length !== 5) {
			setError("Code must be 5 characters long");
			setGameCode("");
			return;
		}

		const response = await csrfFetch(`/api/games/${gameCode}`);
		const game = await response.json();
		if (response.ok) {
			setLocalFromObj("gameState", game);
			history.push(`/game/${gameCode}`);
			return;
		} else {
			const err = response.json();
			setError(err.message);
		}

		// dispatch(thunkLoadGame(gameCode))
		// 	.then(() => {
		// history.push(`/game/${gameCode}`);
		// 	})
		// 	.catch(async res => {
		// 		if (res.status >= 400) {
		// 			const err = await res.json();
		// 			setError(err.message);
		// 		}
		// 		setGameCode("");
		// 		return;
		// 	});
	};

	return (
		<div id="form-container">
			<h1>Join a Drawsome Game</h1>
			<form onSubmit={handleJoinGame}>
				<input
					className={error ? "input-errors" : ""}
					type="text"
					value={gameCode}
					placeholder={error.length > 0 ? error : "enter game code"}
					onChange={e => setGameCode(e.target.value)}
					onFocus={() => setError("")}
				/>
				<button type="submit">Join Game</button>
			</form>
			<p>
				Want to start your own? <Link to="/create-game">Create a game</Link>
			</p>
		</div>
	);
}
