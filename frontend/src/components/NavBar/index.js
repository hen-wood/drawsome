import { useEffect, useState } from "react";

import UserMenu from "./UserMenu";

import "./NavBar.css";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export default function NavBar() {
	const user = useSelector(state => state.session.user);
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
		history.push("/");
	};

	return (
		<div id="nav-bar">
			<h1 onClick={handleHomeClick}>Drawsome</h1>
			{isLoggedIn && (
				<i
					id="user-icon"
					className="fa-regular fa-user"
					onClick={handleOpenMenu}
				></i>
			)}
			<UserMenu
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				setIsLoggedIn={setIsLoggedIn}
				user={user}
			/>
		</div>
	);
}
