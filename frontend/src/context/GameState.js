import { useState, createContext } from "react";

export const GameStateContext = createContext(null);

const GameStateProvider = ({ children }) => {
	const [players, setPlayers] = useState({});
	const [playerCount, setPlayerCount] = useState(0);
	const [gameSection, setGameSection] = useState("lobby");
	const [hasEnded, setHasEnded] = useState(false);
	const [hasStarted, setHasStarted] = useState(false);
	const [roundNum, setRoundNum] = useState(1);

	return (
		<GameStateContext.Provider
			value={{
				players,
				setPlayers,
				gameSection,
				setGameSection,
				hasEnded,
				setHasEnded,
				hasStarted,
				setHasStarted,
				playerCount,
				setPlayerCount,
				roundNum,
				setRoundNum
			}}
		>
			{children}
		</GameStateContext.Provider>
	);
};

export default GameStateProvider;
