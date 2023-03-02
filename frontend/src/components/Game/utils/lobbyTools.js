export const startGame = (gameCode, gameId, socket, thunk, dispatch) => {
	dispatch(thunk(gameId))
		.then(() => {
			socket.emit("creator started game", gameCode);
		})
		.catch(async res => {
			const error = await res.json();
		});
};

export const copyCode = code => {
	navigator.clipboard.writeText(code);
};

export const waitingMessage = (count, limit, userId, creatorId) => {
	const numRemaining = limit - count;
	const gameFull = limit - count === 0;
	const isCreator = userId === creatorId;
	const message = `Waiting for ${
		gameFull && isCreator
			? "you to start the game"
			: gameFull
			? " host to start the game"
			: numRemaining === 1
			? "1 more player to join the game"
			: numRemaining + " more players to join the game"
	}...`;

	return <p>{message}</p>;
};
