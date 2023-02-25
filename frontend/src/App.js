// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import { thunkGetUserDrawings } from "./store/drawings";
import SoloCanvas from "./components/SoloCanvas";
import NavBar from "./components/NavBar";
import Login from "./components/Forms/Login.js";
import JoinGame from "./components/Forms/JoinGame";
import CreateGame from "./components/Forms/CreateGame";
import Signup from "./components/Forms/Signup";
import NotFound from "./components/NotFound";
import UserDrawings from "./components/UserDrawings";
import Game from "./components/Game";

function App() {
	const dispatch = useDispatch();
	const user = useSelector(state => state.session.user);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		dispatch(sessionActions.restoreUser()).then(() => {
			setIsLoaded(true);
		});
	}, [dispatch]);

	useEffect(() => {
		if (user) dispatch(thunkGetUserDrawings(user.id));
	}, [user]);

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
							<SoloCanvas />
						</Route>
						<Route path="/user-drawings">
							<UserDrawings />
						</Route>
						<Route path="/game/:gameCode">
							<Game />
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
