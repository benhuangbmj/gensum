const selectors = [
	"ul.products.columns-3",
	"div.my-column-right",
	"div.my-column",
	"div.wp-block-woocommerce-all-products.wc-block-all-products",
	".qrcode-columns",
];
if ("IntersectionObserver" in window) {
	const observer = new IntersectionObserver(
		(entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("animation-active");
					observer.unobserve(entry.target);
				}
			});
		},
		{ rootMargin: "-300px 0px" },
	);

	for (let selector of selectors) {
		if (document.querySelector(selector))
			observer.observe(document.querySelector(selector));
	}
} else {
	for (let selector of selectors) {
		if (document.querySelector(selector))
			document.querySelector(selector).classList.add("animation-active");
	}
}
