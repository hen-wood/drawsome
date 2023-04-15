export const copyCode = code => {
	navigator.clipboard.writeText(code);
};

export const waitingMessage = (players, limit, userId, creatorId) => {
	const allConnected = players.every(player => player.isConnected);
	const numRemaining = limit - players.length;
	const gameFull = limit - players.length === 0;
	const isCreator = userId === creatorId;
	const message = `Waiting for ${
		!allConnected
			? "all players to connect"
			: gameFull && isCreator
			? "you to start the game"
			: gameFull
			? " host to start the game"
			: numRemaining === 1
			? "1 more player to join the game"
			: numRemaining + " more players to join the game"
	}...`;

	return <p>{message}</p>;
};
