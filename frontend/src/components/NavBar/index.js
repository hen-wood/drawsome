import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import UserMenu from "./UserMenu";
import HowToPlay from "./HowToPlay";
import "./NavBar.css";

export default function NavBar({ theme, setTheme }) {
	const user = useSelector(state => state.session.user);
	const history = useHistory();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [showHow, setShowHow] = useState(false);

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
		<div id="nav-bar">
			<h1
				className={isLoggedIn ? "home-link" : "disabled-home-link"}
				onClick={handleHomeClick}
			>
				Drawsome
			</h1>
			<a href="https://github.com/hen-wood/drawsome" target="_blank">
				<i className="fa-brands fa-github"></i> Project repo
			</a>
			<a href="https://www.linkedin.com/in/henry-woodmansee/" target="_blank">
				<i className="fa-brands fa-linkedin"></i> Henry's linkedin
			</a>
			<div id="how-to-play-user-icon-div">
				<p id="how-to-play-link" onClick={() => setShowHow(true)}>
					How to play
				</p>
				{isLoggedIn && (
					<i
						id="user-icon"
						className="fa-regular fa-user"
						onClick={handleOpenMenu}
					></i>
				)}
			</div>

			{showHow && <HowToPlay setShowHow={setShowHow} />}
			<UserMenu
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				setIsLoggedIn={setIsLoggedIn}
				user={user}
				theme={theme}
				setTheme={setTheme}
			/>
		</div>
	);
}
