// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import DrawingTest from "./components/DrawingTest";
import NavBar from "./components/NavBar";
import Login from "./components/Forms/Login.js";
import * as sessionActions from "./store/session";
import JoinGame from "./components/Forms/JoinGame";
import CreateGame from "./components/Forms/CreateGame";
import Signup from "./components/Forms/Signup";
import NotFound from "./components/NotFound";

function App() {
	const dispatch = useDispatch();

	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		dispatch(sessionActions.restoreUser()).then(() => {
			setIsLoaded(true);
		});
	}, [dispatch]);

	return (
		<div id="main-container">
			<NavBar />
			<div id="inner-container">
				{isLoaded && (
					<Switch>
						<Route exact path="/">
							<JoinGame />
						</Route>
						<Route path="/join-game">
							<JoinGame />
						</Route>
						<Route path="/login">
							<Login />
						</Route>
						<Route path="/signup">
							<Signup />
						</Route>
						<Route path="/create-game">
							<CreateGame />
						</Route>
						<Route path="/draw">
							<DrawingTest />
						</Route>
						<Route>
							<NotFound />
						</Route>
					</Switch>
				)}
			</div>
		</div>
	);
}

export default App;
