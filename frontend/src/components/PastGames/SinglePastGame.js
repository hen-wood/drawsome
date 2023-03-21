import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import OpenDrawing from "./OpenDrawing";
import loadingGif from "../../images/loading.gif";

import "./SinglePastGame.css";

export default function SinglePastGame() {
	const { gameId } = useParams();
	const game = useSelector(state => state.game.pastGames[gameId]);
	const { players, gameRounds } = game;
	const [drawingOpen, setDrawingOpen] = useState(false);
	const [openDrawingUrl, setOpenDrawingUrl] = useState("");
	const [openDrawingTitle, setOpenDrawingTitle] = useState("");

	const handleOpenDrawing = (url, title) => {
		setOpenDrawingTitle(title);
		setOpenDrawingUrl(url);
		setDrawingOpen(true);
	};

	return game ? (
		<div id="single-past-game-container">
			{drawingOpen && (
				<OpenDrawing
					setDrawingOpen={setDrawingOpen}
					drawingUrl={openDrawingUrl}
					title={openDrawingTitle}
				/>
			)}
			<div id="game-results-title">
				<p>Game results...</p>
			</div>
			<div id="game-info-container">
				<div id="player-info-container">
					{players
						.sort((a, b) => b.playerVotes.length - a.playerVotes.length)
						.map((player, i) => {
							const { username, playerVotes } = player;
							const score = playerVotes.length * 100;
							const medalClass =
								i === 0
									? ["🥇", "first-place"]
									: i === 1
									? ["🥈", "second-place"]
									: i === 2
									? ["🥉", "third-place"]
									: ["", "non-podium"];
							return (
								<div key={i} className="past-game-player-card">
									<p className={`podium-info ${medalClass[1]}`}>
										{medalClass[0]}
										{username}
									</p>
									<p className="pg-player-card-score">Final Score: {score}</p>
								</div>
							);
						})}
				</div>
				<div id="round-info-container">
					{gameRounds
						.sort((a, b) => a.roundNumber - b.roundNumber)
						.map((round, i) => {
							const { roundNumber, prompt, roundDrawings } = round;
							return (
								<div key={i} className="round-info-card">
									<div className="round-info-title">
										<p>
											Round {roundNumber}: "{prompt}"
										</p>
									</div>
									<div className="round-info-divider"></div>
									<div className="round-info-drawings-container">
										{roundDrawings
											.sort(
												(a, b) => b.drawingVotes.length - a.drawingVotes.length
											)
											.map((drawing, i) => {
												const { title, drawingUrl, userId, drawingVotes } =
													drawing;
												const { username } = players.find(p => p.id === userId);
												const votes = drawingVotes.length;
												return (
													<div
														key={i}
														className="round-info-drawing-div"
														onClick={() => handleOpenDrawing(drawingUrl, title)}
													>
														<img src={drawingUrl} alt={title} />
														<div className="round-info-drawing-username">
															<p>{username}</p>
															<p>{`${votes} vote${votes === 1 ? "" : "s"}`}</p>
														</div>
													</div>
												);
											})}
									</div>
								</div>
							);
						})}
				</div>
			</div>
		</div>
	) : (
		<img src={loadingGif} alt="loading" />
	);
}
