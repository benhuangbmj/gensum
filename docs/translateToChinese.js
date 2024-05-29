{
	const selectors = {
		"div.wc-block-components-totals-coupon>a": "使用優惠券",
		"h2.wp-block-heading.has-text-align-center.with-empty-cart-icon.wc-block-cart__empty-cart__title": "您的購物車目前沒有任何商品！",
		"div.section2button>a": "繼續閲讀",
		"a.toggleMenu": "菜單",
		"body > div.container > div > section > div > div > nav > ul > li.woocommerce-MyAccount-navigation-link.woocommerce-MyAccount-navigation-link--customer-logout > a": "登出",
		"div.wc-block-components-totals-item__value>a": "添加地址以決定運送方式",
		'div[id*="-state"] label': "州/省",
		//'span[id*="free_shipping"]': '免運費',
		//"div.wc-block-components-totals-item__description.wc-block-components-totals-shipping__via": "免運費",	
		//"label[for=checkbox-control-0] div": "閣下同意接收敝店關於折扣優惠和產品資訊的專屬電郵。",
		//"label[for=checkbox-control-1] div": "閣下同意接收敝店關於折扣優惠和產品資訊的專屬電郵。",
		//"#billing-fields>div.wc-block-components-checkout-step__container>p.wc-block-components-checkout-step__description": "輸入與付款方式吻合的賬單地址（Billing Address)。",
		//"#radio-control-wc-payment-method-options-bacs__label>span.wc-block-components-payment-method-label": "直接銀行匯款（Direct Bank Transfer）",
		//"#radio-control-wc-payment-method-options-cheque__label>span.wc-block-components-payment-method-label": "支票付款 （Check Payments）",
		//"#radio-control-wc-payment-method-options-cod__label>span.wc-block-components-payment-method-label": "現金到付 （Cash on Delivery）",
	}	
	function translate(selector, translation) {
		const elem = document.querySelector(selector);
		if (elem) {elem.text? elem.text=translation : elem.textContent=translation;}
	}
	function handleTranslate(selectors) {
		for (let [selector, translation] of Object.entries(selectors)) {
			translate(selector, translation);
		}
	}

	const html = document.querySelector('html');
	html.style.display = "none";
	const previousOnLoad = window.onload? window.onload : ()=>{};
	window.onload = () => {		
		previousOnLoad();
		const body = document.querySelector('section.site-main');
		const observer = new MutationObserver(() => {		
			handleTranslate(selectors);
		});
		if(body) {
			observer.observe(body, {
				subtree: true,
				childList: true,
			})
		}
		const phone = document.querySelector("div.phone-no>p");
		if (phone) phone.textContent = phone.textContent.replace("Phone", "電話");
		const phoneNo = document.querySelector("div.phone-no");
		if (phoneNo) phoneNo.innerHTML=(phoneNo.innerHTML.replace("Email", "電郵"));		
		handleTranslate(selectors);	
		html.style.display = "initial";	
	}
}