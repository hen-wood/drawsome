import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { thunkCreateGame } from "../../store/games";

import "./Forms.css";

export default function CreateGame() {
	const dispatch = useDispatch();
	const history = useHistory();
	const user = useSelector(state => state.session.user);
	const [numPlayers, setNumPlayers] = useState(3);
	const [timeLimit, setTimeLimit] = useState(3);
	const [errors, setErrors] = useState({});
	const [backendError, setBackendError] = useState("");
	const [rounds, setRounds] = useState([undefined, undefined, undefined]);

	const handleCreateGame = e => {
		e.preventDefault();
		console.log({ rounds });
		const inputErrors = {};
		rounds.forEach((round, i) => {
			if (!round) {
				inputErrors[i] = true;
			}
		});

		if (Object.values(inputErrors).some(val => val === true)) {
			setErrors(inputErrors);
			return;
		}

		const data = {
			numRounds: rounds.length,
			timeLimit,
			numPlayers,
			rounds
		};

		dispatch(thunkCreateGame(data)).then(res =>
			history.push(`/game/${res.code}`)
		);
	};

	const handleUpdateRounds = e => {
		if (+e.target.value > 5) return;
		const newArr = [];
		for (let i = 0; i < +e.target.value; i++) {
			newArr.push(rounds[i] || undefined);
		}
		setRounds(newArr);
	};

	return (
		<div id="create-game-form-container">
			<h1>Create a Drawsome Game</h1>
			{backendError && <p className="backend-errors">{backendError}</p>}
			<form onSubmit={handleCreateGame}>
				<label htmlFor="num-players">Number of players</label>
				<input
					name="num-players"
					type="number"
					value={numPlayers}
					min={3}
					max={8}
					onChange={e => setNumPlayers(e.target.value)}
				/>
				<label htmlFor="num-minutes">Minutes per round</label>
				<input
					name="num-minutes"
					type="number"
					value={timeLimit}
					min={1}
					max={5}
					onChange={e => setTimeLimit(e.target.value)}
				/>
				<label htmlFor="num-rounds">Number of Rounds</label>
				<input
					name="num-rounds"
					type="number"
					value={+rounds.length}
					min={1}
					max={5}
					onChange={handleUpdateRounds}
				/>
				{rounds.map((r, i) => {
					return (
						<input
							key={i}
							type="text"
							className={errors[i] ? "input-errors" : ""}
							placeholder={`Enter prompt for round ${i + 1}`}
							onChange={e => {
								const newRounds = [...rounds];
								newRounds[i] = { prompt: e.target.value, roundNumber: i + 1 };
								setRounds(newRounds);
							}}
							onFocus={() => setErrors(prev => ({ ...prev, [i]: false }))}
						></input>
					);
				})}

				<button type="submit">Create Game</button>
			</form>
			<p>
				Join an existing game <Link to="/join-game">here</Link>
			</p>
		</div>
	);
}
