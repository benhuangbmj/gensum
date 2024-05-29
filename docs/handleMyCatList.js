{
	const previousOnLoad = window.onload? window.onload : () => {};
	window.onload = () => {
		previousOnLoad();
		const sec1 = document.querySelector('#sec1section');
		const catList = document.querySelector('.my-category-list');
		if(sec1 && catList) {
			catList.style.display = 'none';
		} else if (catList) {
			removeBr(catList);
		}
	}
	function removeBr(node) {
		if(node) {
			if(node.localName == 'br') {
				node.remove();
			} else if (node.children) {
				Array.from(node.children).forEach(child => {
					removeBr(child);
				});
			}
		}
	}
}