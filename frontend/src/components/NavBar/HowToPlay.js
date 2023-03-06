import { useRef } from "react";

import drawImg from "../../images/howto/draw.png";
import votingImg from "../../images/howto/voting.png";
import leaderboardImg from "../../images/howto/leaderboard.png";
import finalImg from "../../images/howto/final-scores.png";
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
				<p>1. Draw a picture based on the round's prompt</p>
				<img className="how-to-imgs" src={drawImg} alt="drawing example" />
				<p>
					2. Vote for your favorite drawing at the end of the round. Sorry, you
					can't vote for yourself 😭
				</p>
				<img className="how-to-imgs" src={votingImg} alt="voting example" />
				<p>3. Check out the leaderboard at the end of the round</p>
				<img
					className="how-to-imgs"
					src={leaderboardImg}
					alt="leaderboard example"
				/>
				<p>4. See the results at the end of the game!</p>
				<img
					className="how-to-imgs"
					src={finalImg}
					alt="game results example"
				/>

				<p className="how-to-title">Creating and Joining a game</p>
				<p>
					1. Create a game by setting the number of players, round time limit,
					number of rounds, and a prompt for each round
				</p>
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
