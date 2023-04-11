import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import UserMenu from "./UserMenu";
import HowToPlay from "./HowToPlay";
import "./NavBar.css";
import { Timer } from "../Game/utils/Timer";

export default function NavBar({ theme, setTheme }) {
	const user = useSelector(state => state.session.user);
	const { game, section } = useSelector(state => state.gameState);
	const timeLimit = useSelector(state => state.gameState.currentTimeLimit);

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
					{!game && (
						<div className="about-links">
							<a
								className="about-link"
								href="https://github.com/hen-wood/drawsome"
								target="_blank"
							>
								<i className="fa-brands fa-github"></i> Project repo
							</a>
							<a
								className="about-link"
								href="https://www.linkedin.com/in/henry-woodmansee/"
								target="_blank"
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
			{game && section === "round" ? (
				<div className="nav-bottom">
					<p className="round-info round-info--left">Round 1</p>
					<div className="nav-bottom__center"></div>
					<Timer />
				</div>
			) : section === "vote" ? (
				<div className="nav-bottom">
					<p className="round-info round-info--left">Round 1</p>
					<div className="nav-bottom__center"></div>
					<Timer />
				</div>
			) : section === "leaderboard" ? (
				<div className="nav-bottom">
					<p className="round-info round-info--left">Round 1</p>
					<div className="nav-bottom__center"></div>
					<Timer />
				</div>
			) : (
				<></>
			)}
		</div>
	);
}
