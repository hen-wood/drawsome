import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import UserMenu from "./UserMenu";
import "./NavBar.css";
import { Timer } from "../Game/utils/Timer";

export default function NavBar({ theme, setTheme }) {
	const user = useSelector(state => state.session.user);
	const { game, currentRound, section } = useSelector(state => state.gameState);

	const history = useHistory();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (user) {
			setIsLoggedIn(true);
		}
	}, [user]);

	const handleOpenMenu = () => {
		setIsOpen(!isOpen);
	};

	const handleHomeClick = () => {
		if (isLoggedIn) {
			history.push("/join-game");
		}
	};

	return (
		<div className={`nav-bar ${isOpen && "nav-bar--open"}`}>
			<div className="nav-top">
				<div className="left-nav-links">
					<h1
						className={
							isLoggedIn ? "home-link" : "home-link disabled-home-link"
						}
						onClick={handleHomeClick}
					>
						Drawsome
					</h1>
					{(!game || section === "lobby") && (
						<div className="about-links">
							<a
								className="about-link"
								href="https://github.com/hen-wood/drawsome"
								target="_blank"
								rel="noreferrer"
							>
								<i className="fa-brands fa-github"></i> Project repo
							</a>
							<a
								className="about-link"
								href="https://www.linkedin.com/in/henry-woodmansee/"
								target="_blank"
								rel="noreferrer"
							>
								<i className="fa-brands fa-linkedin"></i> Henry's linkedin
							</a>
						</div>
					)}
				</div>
				{isLoggedIn && (
					<button className="user-menu-button" onClick={handleOpenMenu}>
						<i className="fa-regular fa-user user-icon"></i>
					</button>
				)}
				<UserMenu
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					setIsLoggedIn={setIsLoggedIn}
					user={user}
					theme={theme}
					setTheme={setTheme}
				/>
			</div>
			{game && section !== "lobby" && (
				<div className="nav-bottom">
					<p className="round-info round-info--left">
						{section === "round" &&
							`Round ${game.gameRounds[currentRound].roundNumber}`}
						{section === "vote" &&
							`Vote for the best "${game.gameRounds[currentRound].prompt}"`}
						{section === "round-winner" &&
							(game.gameRounds[currentRound + 1]
								? "Next round starts in"
								: "Game ending in")}
					</p>
					<div className="nav-bottom__center"></div>
					<Timer />
				</div>
			)}
		</div>
	);
}
