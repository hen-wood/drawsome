import { useState, createContext } from "react";

export const GameStateContext = createContext(null);

const GameStateProvider = ({ children }) => {
	const [players, setPlayers] = useState({});
	const [gameSection, setGameSection] = useState("lobby");
	const [roundNum, setRoundNum] = useState(1);
	const [votesSubmitted, setVotesSubmitted] = useState(0);
	const [drawingsSubmitted, setDrawingsSubmitted] = useState(0);
	const [timesUp, setTimesUp] = useState(false);

	return (
		<GameStateContext.Provider
			value={{
				players,
				setPlayers,
				gameSection,
				setGameSection,
				roundNum,
				setRoundNum,
				votesSubmitted,
				setVotesSubmitted,
				drawingsSubmitted,
				setDrawingsSubmitted,
				timesUp,
				setTimesUp
			}}
		>
			{children}
		</GameStateContext.Provider>
	);
};

export default GameStateProvider;
