import puppeteer from "puppeteer";
import path from "path";
import { createServer } from "http-server";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateJpg() {
	console.log("Starting Puppeteer...");
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	// Serve the local files
	console.log("Starting local server...");
	const server = createServer({
		root: path.join(__dirname, "dist"),
	});
	server.listen(8080);

	// Load your HTML content
	console.log("Loading HTML content...");
	await page.goto("http://localhost:8080/index.html", {
		waitUntil: "networkidle0",
	});

	// Wait for the dynamic content to be fully loaded
	console.log("Waiting for dynamic content to load...");
	try {
		await page.waitForSelector("#product-list .product-card", {
			timeout: 60000,
		});
		console.log("Dynamic content loaded.");
	} catch (error) {
		console.error("Error: Selector #product-list .product-card not found.");
		await browser.close();
		server.close();
		return;
	}

	// Capture the screenshot of the product-list div
	console.log("Capturing screenshot of the product-list div...");
	const productList = await page.$("#captured-area");
	await productList.screenshot({
		path: "product-list.jpg",
		type: "jpeg",
		quality: 100,
	});

	await browser.close();
	server.close();
	console.log("Screenshot saved as product-list.jpg");
}

generateJpg().catch(console.error);
