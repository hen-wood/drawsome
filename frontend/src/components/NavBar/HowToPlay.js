import { useRef } from "react";

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
				<h1>How To Play Drawsome</h1>
				<h2>Playing the game</h2>
				<ol>
					<li>Join a game by entering the game code</li>
					<li>
						The host can start the game whenever all the players have joined
					</li>
					<li>
						Draw! Each round will have a prompt and each player will try to draw
						it
					</li>
					<li>
						Vote! Vote on your favorite drawing at the end of each round. Each
						vote is worth 100 points
					</li>
					<li>
						The player with the most points at the end of the last round wins
						the game!
					</li>
				</ol>
				<h2>Creating a game</h2>
				<p>1. Set the number of players (3-8)</p>
				<p>2. Set the minutes per round (1-3)</p>
				<p>3. Set the number of rounds</p>
				<p>4. Set a prompt for each round (1-25 characters long)</p>
				<p>5. Invite friends by sending them the unique game code</p>
			</div>
		</div>
	);
}
