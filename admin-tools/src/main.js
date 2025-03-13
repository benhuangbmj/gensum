import "./style.css";
import axios from "axios";

const themePrime = "#8cba1c";
const themeContrast = "#f0f0d7";

// WooCommerce API credentials
const consumerKey = import.meta.env.VITE_CONSUMER_KEY;
const consumerSecret = import.meta.env.VITE_CONSUMER_SECRET;
const storeUrl = import.meta.env.VITE_STORE_URL;
const auth = btoa(`${consumerKey}:${consumerSecret}`);
const authHeaders = {
	Authorization: `Basic ${auth}`,
};

// Fetch products from WooCommerce
async function fetchProducts() {
	const startTime = Date.now();
	function makePriceRange(regularPriceRange, salePriceRange) {
		let data;
		let on_sale = false;
		if (salePriceRange) {
			data = `
      <span class="product-price-range"><strike>${regularPriceRange}</strike></span>
      <br />
      <span class="on-sale-price">${salePriceRange}</span>
      `;
			on_sale = true;
		} else {
			data = `<span class="product-price-range">${regularPriceRange}</span>`;
		}
		return { data, on_sale };
	}
	console.log("Fetching products...");
	try {
		const response = await axios.get(`${storeUrl}/wp-json/wc/v3/products`, {
			headers: authHeaders,
			params: {
				per_page: 30,
			},
		});
		console.log("Fetched products. Took", Date.now() - startTime);
		const fetchVariatiaonsArray = response.data.map((product) => {
			return async function fetchVariations() {
				let priceRange;
				let regularPriceRange;
				let salePriceRange;
				if (product.variations.length > 0) {
					try {
						const variations = (
							await axios.get(
								`${storeUrl}/wp-json/wc/v3/products/${product.id}/variations`,
								{
									headers: authHeaders,
								}
							)
						)?.data;
						const prices = variations.map((variation) =>
							Number(variation.regular_price)
						);
						regularPriceRange = `$${Math.min(...prices)} - $${Math.max(
							...prices
						)}`;
						const salePrices = variations.filter((variation) =>
							/\d/.test(variation.sale_price)
						);
						if (salePrices.length > 0) {
							const salePricesArray = salePrices.map((variation) =>
								Number(variation.sale_price)
							);
							salePriceRange = `$${Math.min(...salePricesArray)} - $${Math.max(
								...salePricesArray
							)}`;
						}
						priceRange = makePriceRange(regularPriceRange, salePriceRange);
					} catch (error) {
						console.error("Error fetching variations:", error);
						return;
					}
				} else {
					priceRange = makePriceRange(
						"$" + product.regular_price,
						product.sale_price ? "$" + product.sale_price : null
					);
				}
				product.price_range = priceRange;
				return;
			};
		});
		await Promise.all(
			fetchVariatiaonsArray.map((fetchVariations) => fetchVariations())
		);
		console.log("Fetched all variations. Took", Date.now() - startTime);
		return response.data;
	} catch (error) {
		console.error("Error fetching products:", error);
		return [];
	}
}

// Create HTML content for the products
function createHtmlContent(products) {
	let htmlContent = "";
	products
		.filter(
			(product) =>
				product.stock_status === "instock" && /\d/.test(product.price)
		)
		.sort((a, b) => {
			if (a.categories[0]?.name < b.categories[0]?.name) return -1;
			else return 1;
		})
		.forEach((product) => {
			function createCategoryStyle(background, textColor) {
				return `background: ${background}; color: ${textColor};`;
			}
			htmlContent += `
    <div class='product-card'>
  <div class='product-info'>
  <div class="product-category" style="${
		product.categories[0].name === "花旗蔘"
			? createCategoryStyle(themePrime, "white")
			: createCategoryStyle(themeContrast, themePrime)
	}">${product.categories[0]?.name}</div>
  <div class="product-name">${product.name}</div>
  <div class="price-container">${product.price_range.data}</div>
  </div>
  <div class='product-image-container'>
      <img class='product-image' src='${product.images[0].src}' alt='${
				product.name
			}'/>
    ${
			product.price_range.on_sale
				? "<img class='on-sale-icon' src='/on-sale.png'/>"
				: ""
		} 
    </div>
    </div>
  `;
		});
	htmlContent = htmlContent;
	return htmlContent;
}

// Main function to fetch and display products
async function main() {
	const products = await fetchProducts();
	const htmlContent = createHtmlContent(products);
	document.getElementById("product-list").innerHTML = htmlContent;
}

main();
