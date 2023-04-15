import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import OpenDrawing from "./OpenDrawing";
import loadingGif from "../../images/loading.gif";

import "./SinglePastGame.css";
import { thunkGetPastGame } from "../../store/games";

export default function SinglePastGame() {
	const { gameId } = useParams();
	const dispatch = useDispatch();
	const game = useSelector(state => state.game.pastGames[gameId]);
	const [drawingOpen, setDrawingOpen] = useState(false);
	const [openDrawingUrl, setOpenDrawingUrl] = useState("");
	const [openDrawingTitle, setOpenDrawingTitle] = useState("");

	const handleOpenDrawing = (url, title) => {
		setOpenDrawingTitle(title);
		setOpenDrawingUrl(url);
		setDrawingOpen(true);
	};

	useEffect(() => {
		if (!game) {
			dispatch(thunkGetPastGame(gameId));
		}
	}, [game]);

	return game ? (
		<div className="single-past-game-container">
			{drawingOpen && (
				<OpenDrawing
					setDrawingOpen={setDrawingOpen}
					drawingUrl={openDrawingUrl}
					title={openDrawingTitle}
				/>
			)}
			<div className="game-results-title">
				<p>Game results...</p>
			</div>
			<div className="game-info-container">
				<div className="player-info-container">
					{game.players
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
				<div className="round-info-container">
					{game.gameRounds
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
												const { username } = game.players.find(
													p => p.id === userId
												);
												const votes = drawingVotes.length;
												return (
													<div
														key={i}
														className="round-info-drawing-div"
														onClick={() => handleOpenDrawing(drawingUrl, title)}
													>
														<img src={drawingUrl} alt={title} />
														<div className="drawing-stats">
															<p className="drawing-stats__text drawing-stats__username">
																{username}
															</p>
															<p className="drawing-stats__text drawing-stats__vote-count">{`${votes} vote${
																votes === 1 ? "" : "s"
															}`}</p>
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
