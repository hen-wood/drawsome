import { useContext } from "react";
import { GameStateContext } from "../../context/GameState";

export default function GameVote() {
	const { roundNum, setRoundNum } = useContext(GameStateContext);
	return <h1>Hello from round {roundNum} voting thing</h1>;
}
