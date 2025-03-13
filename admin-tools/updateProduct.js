import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

const consumerKey = process.env.VITE_CONSUMER_KEY;
const consumerSecret = process.env.VITE_CONSUMER_SECRET;
const storeUrl = process.env.VITE_STORE_URL;
const auth = btoa(`${consumerKey}:${consumerSecret}`);
const authHeaders = {
  Authorization: `Basic ${auth}`,
};

async function updateSalePrices(productNames) {
  try {
    // Fetch all products
    const response = await axios.get(`${storeUrl}/wp-json/wc/v3/products`, {
      headers: authHeaders,
      params: {
        per_page: 30, // Adjust as needed
      },
    });
    const products = response.data;

    // Filter products by names
    const filteredProducts = products.filter((product) =>
      productNames.includes(product.name)
    );

    // Update sale prices for variations
    for (const product of filteredProducts) {
      if (product.variations.length > 0) {
        const variationsResponse = await axios.get(
          `${storeUrl}/wp-json/wc/v3/products/${product.id}/variations`,
          {
            headers: authHeaders,
          }
        );
        const variations = variationsResponse.data;

        for (const variation of variations) {
          const regularPrice = Number(variation.regular_price);
          const salePrice = (Math.round(regularPrice * 0.95) - 0.12).toFixed(2);
          await axios.put(
            `${storeUrl}/wp-json/wc/v3/products/${product.id}/variations/${variation.id}`,
            {
              sale_price: salePrice,
            },
            {
              headers: authHeaders,
            }
          );
          console.log(
            `Updated sale price for ${product.name} - ${variation.id}: ${salePrice}`
          );
        }
      }
    }
    console.log("Sale prices updated successfully.");
  } catch (error) {
    console.error("Error updating sale prices:", error);
  }
}

// Example usage
const productNames = [];
updateSalePrices(productNames);
