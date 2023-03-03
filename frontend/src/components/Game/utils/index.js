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
	return JSON.parse(localStorage.getItem(key));
}

export function setLocalFromStr(key, str) {
	localStorage.setItem(key, str);
}

export function updateLocal(key, prop, val) {
	const localData = JSON.parse(localStorage.getItem(key));
	localData[prop] = val;
	localStorage.setItem(key, JSON.stringify(localData));
	return;
}
