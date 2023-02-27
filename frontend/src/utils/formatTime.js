export default function formatTime(seconds) {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	const formattedMinutes = String(minutes);
	const formattedSeconds = String(remainingSeconds).padStart(2, "0");
	return `${formattedMinutes}:${formattedSeconds}`;
}
