import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { thunkLoadGame } from "../../store/games";

import "./Forms.css";

export default function JoinGame() {
	const dispatch = useDispatch();
	const history = useHistory();
	const user = useSelector(state => state.session.user);
	const [gameCode, setGameCode] = useState("");
	const [error, setError] = useState("");

	const handleJoinGame = e => {
		e.preventDefault();
		console.log(gameCode);
		if (gameCode.length !== 5) {
			setError("Code must be 5 characters long");
			setGameCode("");
			return;
		}

		dispatch(thunkLoadGame(gameCode))
			.then(() => {
				history.push(`/game/${gameCode}`);
			})
			.catch(async res => {
				const err = await res.json();
				setError(err.message);
				setGameCode("");
			});
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
