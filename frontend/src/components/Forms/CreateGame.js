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
	const [timeLimit, setTimeLimit] = useState(2);
	const [errors, setErrors] = useState({});
	const [backendError, setBackendError] = useState("");
	const [rounds, setRounds] = useState([undefined, undefined]);

	const handleCreateGame = e => {
		e.preventDefault();
		console.log({ rounds });
		const inputErrors = {};
		rounds.forEach((round, i) => {
			if (!round) {
				inputErrors[i] = true;
			}
		});
		if (+numPlayers < 3 || +numPlayers > 8) {
			inputErrors["numPlayers"] = "Number of players must be 3-8";
		}

		if (+timeLimit < 1 || +timeLimit > 5) {
			inputErrors["timeLimit"] = "Rounds must be 1-5 minutes long";
		}

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
				<label htmlFor="num-players">Number of players (3-8)</label>
				<input
					className={errors["numPlayers"] ? "input-errors" : ""}
					placeholder={errors["numPlayers"] ? errors["numPlayers"] : ""}
					name="num-players"
					type="number"
					value={numPlayers}
					min={3}
					max={8}
					onChange={e => setNumPlayers(e.target.value)}
					onFocus={() =>
						setErrors(prev => ({ ...prev, ["numPlayers"]: false }))
					}
				/>
				<label htmlFor="num-minutes">Minutes per round (1-3)</label>
				<input
					className={errors["timeLimit"] ? "input-errors" : ""}
					placeholder={errors["timeLimit"] ? errors["timeLimit"] : ""}
					name="num-minutes"
					type="number"
					value={timeLimit}
					min={1}
					max={3}
					onChange={e => setTimeLimit(e.target.value)}
					onFocus={() => setErrors(prev => ({ ...prev, ["timeLimit"]: false }))}
				/>
				<label htmlFor="num-rounds">Number of Rounds (1-5)</label>
				<input
					name="num-rounds"
					type="number"
					value={rounds.length}
					min={1}
					max={5}
					onChange={handleUpdateRounds}
					onBlur={e => (e.target.value = +e.target.value)}
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
