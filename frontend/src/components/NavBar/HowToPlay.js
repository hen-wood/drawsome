import { useRef } from "react";

import createGameImg from "../../images/howto/create-game.png";
import copyCodeImg from "../../images/howto/copy-game-code.png";
import joinGameImg from "../../images/howto/join-game.png";
import startGameImg from "../../images/howto/start-game.png";
import "./HowToPlay.css";

export default function HowToPlay({ setShowHow }) {
	const innerHowTo = useRef(null);
	const xButton = useRef(null);

	const handleCloseClick = e => {
		if (
			innerHowTo.current.parentElement === e.target ||
			e.target === xButton.current
		)
			setShowHow(false);
	};
	return (
		<div id="how-to-play-outer" onClick={handleCloseClick}>
			<div id="how-to-play-inner" ref={innerHowTo}>
				<i className="fa-solid fa-xmark" id="close-how-to" ref={xButton}></i>
				<p className="how-to-title">Playing the game</p>
				<p className="how-to-title">Creating and Joining a game</p>
				<p>1. Create a game</p>
				<img className="how-to-imgs" src={createGameImg} alt="create a game" />
				<p>2. Copy the game code and send it to some friends</p>
				<img className="how-to-imgs" src={copyCodeImg} alt="copy game code" />
				<p>3. Wait for them to join the game</p>
				<img className="how-to-imgs" src={joinGameImg} alt="join game" />
				<p>4. Start playing!</p>
				<img className="how-to-imgs" src={startGameImg} alt="join game" />
			</div>
		</div>
	);
}
