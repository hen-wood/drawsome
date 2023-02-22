import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";

export default function UserMenu({ isOpen, setIsOpen, setIsLoggedIn }) {
	const dispatch = useDispatch();
	const history = useHistory();

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
			setIsOpen(false);
			setIsLoggedIn(false);
			history.push("/login");
		});
	};

	return (
		<div className={isOpen ? "user-menu" : "user-menu-hidden"}>
			<p className="user-options">View Past Drawings</p>
			<p className="user-options" onClick={handleCreateGame}>
				Create Game
			</p>
			<p className="user-options" onClick={handleJoinGame}>
				Join Game
			</p>
			<div className="divider"></div>
			<p className="user-options" onClick={handleLogout}>
				Logout
			</p>
		</div>
	);
}
