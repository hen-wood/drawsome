// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
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
import GameStateProvider from "./context/GameState";
import SocketProvider from "./context/Socket";

function App() {
	const history = useHistory();
	const dispatch = useDispatch();
	const user = useSelector(state => state.session.user);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		dispatch(sessionActions.restoreUser()).then(() => {
			setIsLoaded(true);
		});
	}, [dispatch]);

	useEffect(() => {
		if (user) {
			dispatch(thunkGetUserDrawings(user.id));
			history.push("/join-game");
		} else {
			history.push("/login");
		}
	}, [user]);

	return (
		<div id="main-container">
			<NavBar />
			<div id="inner-container">
				{isLoaded && (
					<Switch>
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
							<GameStateProvider>
								<SocketProvider>
									<Game />
								</SocketProvider>
							</GameStateProvider>
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
