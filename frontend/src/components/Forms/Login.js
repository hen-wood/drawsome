import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { login } from "../../store/session";

import isValidEmail from "../../utils/isValidEmail";

import "./Forms.css";

export default function Login() {
	const dispatch = useDispatch();
	const history = useHistory();
	const user = useSelector(state => state.session.user);
	const [credential, setCredential] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const [backendError, setBackendError] = useState("");

	useEffect(() => {
		if (user) {
			history.push("/");
		}
	}, [user]);

	const handleLogin = e => {
		e.preventDefault();

		const newErrors = {};

		if (!isValidEmail(credential)) {
			newErrors.email = "Email must be a valid format";
			setCredential("");
		}

		if (password.length < 8 || password.length > 20) {
			newErrors.password = "Password must be 8-15 characters long";
			setPassword("");
		}

		if (Object.keys(newErrors).length) {
			setErrors(newErrors);
			return;
		}

		dispatch(login({ credential, password }))
			.then(() => history.push("/join-game"))
			.catch(async res => {
				const data = await res.json();
				setBackendError(data.message);
			});
	};

	return (
		<div className="form-container">
			<h1 className="form-title">Log in to Drawsome</h1>
			{backendError && <p className="backend-errors">{backendError}</p>}
			<form onSubmit={handleLogin}>
				<input
					className={errors.email ? "input-field input-errors" : "input-field"}
					type="text"
					value={credential}
					placeholder={errors.email || "email"}
					onChange={e => setCredential(e.target.value)}
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
				<button type="submit">Log in</button>
			</form>
			<div className="demo-login-buttons">
				<button
					onClick={() =>
						dispatch(
							login({ credential: "demo1@user.io", password: "password" })
						)
							.then(() => history.push("/join-game"))
							.catch(async res => {
								const data = await res.json();
								setBackendError(data.message);
							})
					}
				>
					Log in Demo User #1
				</button>
				<button
					onClick={() =>
						dispatch(
							login({ credential: "demo2@user.io", password: "password" })
						)
							.then(() => history.push("/join-game"))
							.catch(async res => {
								const data = await res.json();
								setBackendError(data.message);
							})
					}
				>
					Log in Demo User #2
				</button>
				<button
					onClick={() =>
						dispatch(
							login({ credential: "demo3@user.io", password: "password" })
						)
							.then(() => history.push("/join-game"))
							.catch(async res => {
								const data = await res.json();
								setBackendError(data.message);
							})
					}
				>
					Log in Demo User #3
				</button>
			</div>
			<p className="form-login-signup-prompt">
				Don't have an account yet? <Link to="/signup">Sign up</Link>
			</p>
		</div>
	);
}
