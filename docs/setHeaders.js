const previousOnLoad = window.onload? window.onload : () => {};
window.onload = () => {
	previousOnLoad();
	const pageTitle = document.querySelector('h1.page-title');
	if (pageTitle && pageTitle.textContent == "花旗蔘") {
		const header = document.createElement('div');
		const pageContent = document.querySelector('div.page_content');
		pageContent.insertBefore(header, pageContent.children[2]);
		header.style.height = "563px";
		header.style.backgroundImage = "url('https://gensomeginseng.com/wp-content/uploads/2024/05/ginseng-banner.png')";
	}
}