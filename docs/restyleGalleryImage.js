{
	const previousOnLoad = window.onload ? window.onload : () => {};
	window.onload = () => {
		previousOnLoad();
		const div = document.querySelector("div.flex-viewport");
		if (div) {
			div.style.setProperty("width", "auto", "important");
			div.style.setProperty("height", "auto", "important");
			const observer = new MutationObserver(() => {
				if (div.style.getPropertyPriority("width") != "important");
				{
					div.style.setProperty("width", "auto", "important");
					div.style.setProperty("height", "auto", "important");
					div.style.setProperty("maxWidth", "99vw", "important");
				}
			});
			observer.observe(div, {
				attributes: true,
			});
		}
	};
}
