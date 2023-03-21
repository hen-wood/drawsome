// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import * as sessionActions from "./store/session";
import { thunkGetUserDrawings } from "./store/drawings";
import NavBar from "./components/NavBar";
import Login from "./components/Forms/Login.js";
import JoinGame from "./components/Forms/JoinGame";
import CreateGame from "./components/Forms/CreateGame";
import Signup from "./components/Forms/Signup";
import NotFound from "./components/NotFound";
import UserDrawings from "./components/UserDrawings";
import Game from "./components/Game";
import SocketProvider from "./context/Socket";
import PastGames from "./components/PastGames";
import SinglePastGame from "./components/PastGames/SinglePastGame";
import SoloDraw from "./components/SoloDraw";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
	const history = useHistory();
	const dispatch = useDispatch();
	const user = useSelector(state => state.session.user);
	const [isLoaded, setIsLoaded] = useState(false);
	const [theme, setTheme] = useState("light-mode");

	useEffect(() => {
		dispatch(sessionActions.restoreUser()).then(() => {
			setIsLoaded(true);
		});
	}, [dispatch]);

	return (
		<div id="main-container" className={theme}>
			<NavBar theme={theme} setTheme={setTheme} />
			<div id="inner-container">
				{isLoaded && (
					<Switch>
						<Route exact path="/">
							<JoinGame />
						</Route>
						<ProtectedRoute path="/join-game">
							<JoinGame />
						</ProtectedRoute>
						<Route path="/login">
							<Login />
						</Route>
						<Route path="/signup">
							<Signup />
						</Route>
						<ProtectedRoute path="/create-game">
							<CreateGame />
						</ProtectedRoute>
						<ProtectedRoute path="/draw">
							<SoloDraw />
						</ProtectedRoute>
						<ProtectedRoute path="/user-drawings">
							<UserDrawings />
						</ProtectedRoute>
						<ProtectedRoute path="/game/:gameCode">
							<SocketProvider>
								<Game />
							</SocketProvider>
						</ProtectedRoute>
						<ProtectedRoute exact path="/past-games">
							<PastGames />
						</ProtectedRoute>
						<ProtectedRoute path="/past-games/:gameId">
							<SinglePastGame />
						</ProtectedRoute>
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
