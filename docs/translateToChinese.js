function translate(selector, translation) {
	const elem = document.querySelector(selector);
	if (elem) {elem.text? elem.text=translation : elem.textContent=translation;}
}
const html = document.querySelector('html');
html.style.display = "none";
window.onload = () => {		
	const phone = document.querySelector("div.phone-no>p");
	if (phone) phone.textContent = phone.textContent.replace("Phone", "電話");
	const phoneNo = document.querySelector("div.phone-no");
	if (phoneNo) phoneNo.innerHTML=(phoneNo.innerHTML.replace("Email", "電郵"));	
	const selectors = {
		"div.wc-block-components-totals-coupon>a": "使用優惠券",
		"h2.wp-block-heading.has-text-align-center.with-empty-cart-icon.wc-block-cart__empty-cart__title": "您的購物車目前沒有任何商品！",
		"div.section2button>a": "繼續閲讀",
		"a.toggleMenu": "菜單",
		"body > div.container > div > section > div > div > nav > ul > li.woocommerce-MyAccount-navigation-link.woocommerce-MyAccount-navigation-link--customer-logout > a": "登出",
		"div.wc-block-components-totals-item__value>a": "添加地址以決定運送方式",
		"label.components-base-control__label.css-4dk55l.e1puf3u1": "州",
	}
	for (let [selector, translation] of Object.entries(selectors)) {
		translate(selector, translation);
	}
	html.style.display = "initial";
}