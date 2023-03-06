import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/session";
import { useEffect, useRef } from "react";

export default function UserMenu({ isOpen, setIsOpen, setIsLoggedIn, user }) {
	const dispatch = useDispatch();
	const history = useHistory();
	const menu = useRef(null);

	const handleDrawSolo = () => {
		setIsOpen(false);
		history.push("/draw");
	};

	const handleViewDrawings = () => {
		setIsOpen(false);
		history.push("/user-drawings");
	};

	const handleCreateGame = () => {
		setIsOpen(false);
		history.push("/create-game");
	};

	const handleJoinGame = () => {
		setIsOpen(false);
		history.push("/join-game");
	};

	const handleLogout = () => {
		dispatch(logout()).then(() => {
			history.push("/login");
			setIsOpen(false);
			setIsLoggedIn(false);
		});
	};

	const closeMenu = e => {
		if (!menu.current.contains(e.target)) setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) document.addEventListener("click", closeMenu);
		return () => {
			document.removeEventListener("click", closeMenu);
		};
	}, [isOpen]);

	return (
		<div ref={menu} className={isOpen ? "user-menu" : "user-menu-hidden"}>
			<p id="menu-username">{user && user.username} 🧑‍🎨</p>
			<div className="divider"></div>
			<p className="user-options" onClick={handleCreateGame}>
				Create Game
			</p>
			<p className="user-options" onClick={handleJoinGame}>
				Join Game
			</p>
			<p className="user-options" onClick={handleDrawSolo}>
				Draw solo
			</p>
			<p className="user-options" onClick={handleViewDrawings}>
				View Past Drawings
			</p>
			<div className="divider"></div>
			<p className="user-options" onClick={handleLogout}>
				Logout
			</p>
		</div>
	);
}
