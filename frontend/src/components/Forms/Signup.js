import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { signup } from "../../store/session";

import isValidEmail from "../../utils/isValidEmail";

import "./Forms.css";

export default function Signup() {
	const user = useSelector(state => state.session.user);
	const dispatch = useDispatch();
	const history = useHistory();
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [matchPassword, setMatchPassword] = useState("");
	const [errors, setErrors] = useState({});
	const [backendError, setBackendError] = useState("");

	useEffect(() => {
		if (user) {
			history.push("/join-game");
		}
	}, [user]);

	const handleSignup = e => {
		e.preventDefault();
		const newErrors = {};

		if (username.length < 4 || username.length > 15) {
			newErrors.username = "Username must be 4-15 characters long";
			setUsername("");
		}

		if (isValidEmail(username)) {
			newErrors.username = "Username cannot be an email";
			setUsername("");
		}

		if (!isValidEmail(email)) {
			newErrors.email = "Email must be a valid format";
			setEmail("");
		}

		if (password.length < 8 || password.length > 20) {
			newErrors.password = "Password must be 8-15 characters long";
			setPassword("");
			setMatchPassword("");
		}

		if (matchPassword !== password) {
			newErrors.matchPassword = "Must match password";
			setMatchPassword("");
		}

		if (Object.keys(newErrors).length) {
			setErrors(newErrors);
			return;
		}

		dispatch(signup({ username, email, password }))
			.then(() => history.push("/join-game"))
			.catch(async res => {
				const data = await res.json();
				setBackendError(data.message);
			});
	};
	return (
		<div className="form-container">
			<h1 className="form-title">Sign up for Drawsome</h1>
			{backendError && <p className="backend-errors">{backendError}</p>}
			<form onSubmit={handleSignup}>
				<input
					className={
						errors.username ? "input-field input-errors" : "input-field"
					}
					type="text"
					value={username}
					placeholder={errors.username || "username"}
					onChange={e => setUsername(e.target.value)}
					onFocus={() =>
						setErrors(errs => {
							const username = null;
							return { ...errs, username };
						})
					}
				/>
				<input
					className={errors.email ? "input-field input-errors" : "input-field"}
					type="text"
					value={email}
					placeholder={errors.email || "email"}
					onChange={e => setEmail(e.target.value)}
					onFocus={() =>
						setErrors(errs => {
							const email = null;
							return { ...errs, email };
						})
					}
				/>
				<input
					className={
						errors.password ? "input-field input-errors" : "input-field"
					}
					type="password"
					value={password}
					placeholder={errors.password || "password"}
					onChange={e => setPassword(e.target.value)}
					onFocus={() =>
						setErrors(errs => {
							const password = null;
							return { ...errs, password };
						})
					}
				/>
				<input
					className={
						errors.matchPassword ? "input-field input-errors" : "input-field"
					}
					type="password"
					value={matchPassword}
					placeholder={errors.matchPassword || "confirm password"}
					onChange={e => setMatchPassword(e.target.value)}
					onFocus={() =>
						setErrors(errs => {
							const matchPassword = null;
							return { ...errs, matchPassword };
						})
					}
				/>
				<button type="submit">Submit</button>
			</form>
			<p className="form-login-signup-prompt">
				Already have an account? <Link to="/login">Log in</Link>
			</p>
		</div>
	);
}
