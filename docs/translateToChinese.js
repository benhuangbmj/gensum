{
	const selectors = {
		"div.wc-block-components-totals-coupon>a": "使用優惠券",
		"div.wc-block-components-totals-coupon>div>button": "使用優惠券",
		"h2.wp-block-heading.has-text-align-center.with-empty-cart-icon.wc-block-cart__empty-cart__title":
			"您的購物車目前沒有任何商品！",
		"div.section2button>a": "瞭解更多",
		"a.toggleMenu": "菜單",
		"body > div.container > div > section > div > div > nav > ul > li.woocommerce-MyAccount-navigation-link.woocommerce-MyAccount-navigation-link--customer-logout > a":
			"登出",
		"div.wc-block-components-totals-item__value>a":
			"添加地址以決定運送方式",
		"#wc-block-components-totals-shipping__change-address__link":
			"添加地址以決定運送方式",
		'div[id*="-state"] label': "州/省",
		"div.slide_info>a.slide_more": "瞭解更多",
	};
	const replaceSelectors = {
		"div.wc-block-components-validation-error > p": {
			original: "Please enter a valid ",
			replacement: "請輸入一個有效的",
		},
		"button.wc-block-components-address-form__address_2-toggle": {
			original: "Add ",
			replacement: "加插 ",
		},
		"a.wpmenucart-contents > span.cartcontents": {
			original: " items",
			replacement: " 件商品",
		},
		"div.wc-block-components-totals-coupon__content>div.wc-block-components-validation-error>p":
			[
				{
					original: "The minimum spend for this coupon is ",
					replacement: "本優惠券的消費下限為",
				},
				{
					original: /Coupon "[\w\W]*" does not exist/,
					replacement: "您所輸入的優惠券代碼不存在",
				},
				{
					original: "This coupon has expired.",
					replacement: "抱歉， 此優惠券已過期。",
				},
			],
		"div.wc-block-components-notice-banner__content > div": {
			original:
				/The “[\w\W]*” coupon has been removed from your cart: The minimum spend for this coupon is \$[\w\W]*\./,
			replacement: "由於消費額度不滿足下限條件， 我們移除了部分優惠券。",
		},
	};
	function translate(selector, translation) {
		const elem = document.querySelector(selector);
		if (elem) {
			elem.text
				? (elem.text = translation)
				: (elem.textContent = translation);
		}
	}
	function translateByReplace(selector, original, replacement) {
		const elems = document.querySelectorAll(selector);
		elems.forEach((elem) => {
			const target = elem.text ? "text" : "textContent";
			elem[target] = elem[target].replace(original, replacement);
		});
	}
	function handleTranslate(selectors, replaceSelectors) {
		for (let [selector, translation] of Object.entries(selectors)) {
			translate(selector, translation);
		}
		for (let [selector, translation] of Object.entries(replaceSelectors)) {
			if (!Array.isArray(translation)) {
				const { original, replacement } = translation;
				translateByReplace(selector, original, replacement);
			} else {
				translation.forEach(({ original, replacement }) =>
					translateByReplace(selector, original, replacement),
				);
			}
		}
	}
	const html = document.querySelector("html");
	html.style.display = "none";
	const previousOnLoad = window.onload ? window.onload : () => {};
	window.onload = () => {
		previousOnLoad();
		const totalShipping = document.querySelector(
			"div.wc-block-components-totals-shipping",
		);
		const shippingFields = document.querySelector("#shipping-fields");
		const observer = new MutationObserver((record, mo) => {
			handleTranslate(selectors, replaceSelectors);
		});
		if (html) {
			observer.observe(html, {
				subtree: true,
				attributes: true,
			});
		}
		const phone = document.querySelector("div.phone-no>p");
		if (phone)
			phone.textContent = phone.textContent.replace("Phone", "電話");
		const phoneNo = document.querySelector("div.phone-no");
		if (phoneNo)
			phoneNo.innerHTML = phoneNo.innerHTML.replace("Email", "電郵");
		handleTranslate(selectors, replaceSelectors);
		html.style.display = "initial";
	};
}
