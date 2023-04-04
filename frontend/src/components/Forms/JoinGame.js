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

	const handleJoinGame = e => {
		e.preventDefault();
		if (gameCode.length !== 5) {
			setError("Code must be 5 characters long");
			setGameCode("");
			return;
		}

		csrfFetch(`/api/games/${gameCode}`)
			.then(res => res.json())
			.then(game => {
				setLocalFromObj("gameState", game);
				history.push(`/game/${gameCode}`);
				return;
			})
			.catch(async res => {
				const err = await res.json();
				setError(err.message);
				setGameCode("");
				return;
			});
	};

	return (
		<div className="form-container">
			<h1 className="form-title">Join a Drawsome Game</h1>
			<form onSubmit={handleJoinGame}>
				<input
					className={error ? "input-field input-errors" : "input-field"}
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
