export function getLocalAsStr(key) {
	const localData = localStorage.getItem(key);
	return localData;
}

export function getLocalAsObj(key) {
	const localData = localStorage.getItem(key);
	return JSON.parse(localData);
}

export function setLocalFromObj(key, obj) {
	localStorage.setItem(key, JSON.stringify(obj));
	return obj;
}

export function setLocalFromStr(key, str) {
	localStorage.setItem(key, str);
	return JSON.parse(localStorage.getItem(key));
}

export function updateLocalSection(section) {
	const localData = JSON.parse(localStorage.getItem("gameState"));
	localData.section = section;
	if (section === "vote") localData.voteCount = 0;
	localStorage.setItem("gameState", JSON.stringify(localData));
	return localData;
}

export function updateLocalCurrRound() {
	const localData = JSON.parse(localStorage.getItem("gameState"));
	localData.currentRound =
		localData.gameRounds[localData.currentRound.roundNumber];
	localData.drawings[localData.currentRound.id] = {};
	localData.section = "round";
	const hostDataStr = JSON.stringify(localData);
	localStorage.setItem("gameState", hostDataStr);
	return hostDataStr;
}

export function updateLocalVote(userId) {
	const localData = JSON.parse(localStorage.getItem("gameState"));
	if (localData.votes[userId]) {
		localData.votes[userId] = 1;
	} else {
		localData.votes[userId]++;
	}
	localData.scores[userId] += 100;
	localData.voteCount++;
	localStorage.setItem("gameState", JSON.stringify(localData));
	return localData;
}

export function updateLocalDrawings(roundId, userId, drawingData) {
	const localData = JSON.parse(localStorage.getItem("gameState"));
	localData.drawings = {
		...localData.drawings,
		[roundId]: { ...localData.drawings[roundId], [userId]: drawingData }
	};
	localData.votes[userId] = 0;
	localData.voteCount = 0;
	localStorage.setItem("gameState", JSON.stringify(localData));
	return localData;
}
