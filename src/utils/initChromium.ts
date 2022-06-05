import puppeteer from "puppeteer";

export default async function initChromium(){
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    const version = await page.browser().version();

    return version;
}