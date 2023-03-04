import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { csrfFetch } from "../../store/csrf";
import { setLocalFromObj } from "../Game/utils/localFunctions";
import { thunkCreateGame } from "../../store/games";
import getPrompt from "../../utils/randomPrompt";

import "./Forms.css";

export default function CreateGame() {
	const dispatch = useDispatch();
	const history = useHistory();
	const [numPlayers, setNumPlayers] = useState(3);
	const [timeLimit, setTimeLimit] = useState(2);
	const [errors, setErrors] = useState({});
	const [rounds, setRounds] = useState([undefined, undefined]);

	const handleCreateGame = async e => {
		e.preventDefault();
		const inputErrors = {};
		rounds.forEach((round, i) => {
			if (!round || !round.prompt) {
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
			setErrors(prev => ({ ...prev, ...inputErrors }));
			return;
		}

		const newGame = {
			numRounds: rounds.length,
			timeLimit,
			numPlayers,
			rounds
		};

		const response = await csrfFetch(`/api/games`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(newGame)
		});
		if (response.ok) {
			const game = await response.json();
			setLocalFromObj("gameState", game);
			history.push(`/game/${game.code}`);
			return;
		} else {
			const err = await response.json();
			console.log(err);
		}

		// dispatch(thunkCreateGame(data)).then(res =>
		// 	history.push(`/game/${res.code}`)
		// );
	};

	const handleUpdateRounds = val => {
		if (val > 5) return;
		const newArr = [];
		for (let i = 0; i < val; i++) {
			newArr.push(rounds[i] || undefined);
		}
		setRounds(newArr);
	};

	return (
		<div id="create-game-form-container">
			<h1>Create a Drawsome Game</h1>
			<form onSubmit={handleCreateGame}>
				<label htmlFor="num-players">Number of players (3-8)</label>
				<div className="create-game-input-div">
					<div className="increase-decrease-div">
						<i
							className="fa-solid fa-minus"
							onClick={() => {
								if (numPlayers > 3) setNumPlayers(p => +p - 1);
							}}
						></i>
						<i
							className="fa-solid fa-plus"
							onClick={() => {
								if (numPlayers < 8) setNumPlayers(p => +p + 1);
							}}
						></i>
					</div>
					<input
						className={errors["numPlayers"] ? "input-errors" : ""}
						placeholder={errors["numPlayers"] ? errors["numPlayers"] : ""}
						name="num-players"
						type="number"
						value={+numPlayers}
						min={3}
						max={8}
						onChange={e => setNumPlayers(+e.target.value)}
						onFocus={() =>
							setErrors(prev => ({ ...prev, ["numPlayers"]: false }))
						}
					/>
				</div>
				<label htmlFor="num-minutes">Minutes per round (1-3)</label>
				<div className="create-game-input-div">
					<div className="increase-decrease-div">
						<i
							className="fa-solid fa-minus"
							onClick={() => {
								if (timeLimit > 1) setTimeLimit(p => +p - 1);
							}}
						></i>
						<i
							className="fa-solid fa-plus"
							onClick={() => {
								if (timeLimit < 3) setTimeLimit(p => +p + 1);
							}}
						></i>
					</div>
					<input
						className={errors["timeLimit"] ? "input-errors" : ""}
						placeholder={errors["timeLimit"] ? errors["timeLimit"] : ""}
						name="num-minutes"
						type="number"
						value={+timeLimit}
						min={1}
						max={3}
						onChange={e => setTimeLimit(+e.target.value)}
						onFocus={() =>
							setErrors(prev => ({ ...prev, ["timeLimit"]: false }))
						}
					/>
				</div>
				<label htmlFor="num-rounds">Number of Rounds (1-5)</label>
				<div className="create-game-input-div">
					<div className="increase-decrease-div">
						<i
							className="fa-solid fa-minus"
							onClick={() => {
								if (rounds.length > 1) handleUpdateRounds(rounds.length - 1);
							}}
						></i>
						<i
							className="fa-solid fa-plus"
							onClick={() => {
								if (rounds.length < 5) handleUpdateRounds(rounds.length + 1);
							}}
						></i>
					</div>
					<input
						name="num-rounds"
						type="number"
						value={rounds.length}
						min={1}
						max={5}
						onChange={e => handleUpdateRounds(+e.target.value)}
						onBlur={e => (e.target.value = +e.target.value)}
					/>
				</div>
				{rounds.map((r, i) => {
					return (
						<div key={i} className="create-game-input-div">
							<i
								className="fa-solid fa-dice get-prompt-button"
								onClick={e => {
									const randPrompt = getPrompt();
									e.target.nextSibling.value = randPrompt;
									const newRounds = [...rounds];
									newRounds[i] = { prompt: randPrompt, roundNumber: i + 1 };
									setRounds(newRounds);
								}}
							></i>
							<input
								type="text"
								className={
									errors[i] ? "input-errors prompt-input" : "prompt-input"
								}
								placeholder={`Enter prompt for round ${i + 1}`}
								onChange={e => {
									if (e.target.value.length <= 25) {
										const newRounds = [...rounds];
										newRounds[i] = {
											prompt: e.target.value,
											roundNumber: i + 1
										};
										setRounds(newRounds);
									} else {
										e.target.value = rounds[i].prompt;
									}
								}}
								onFocus={() => setErrors(prev => ({ ...prev, [i]: false }))}
							></input>
						</div>
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
