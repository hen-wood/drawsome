import { useEffect } from "react";

export function useTouchPrevention() {
	useEffect(() => {
		const preventDefault = event => {
			if (event.touches.length > 1 || (event.scale && event.scale !== 1)) {
				event.preventDefault();
			}
		};

		const preventTouchMove = event => event.preventDefault();

		document.addEventListener("touchstart", preventDefault, { passive: false });
		document.addEventListener("touchmove", preventTouchMove, {
			passive: false
		});

		return () => {
			document.removeEventListener("touchstart", preventDefault);
			document.removeEventListener("touchmove", preventTouchMove);
		};
	}, []);
}
