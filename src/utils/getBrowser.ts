import puppeteer, { LaunchOptions } from "puppeteer"

const DEV_OPTIONS: object = {
    headless: false,
    slowMo: 0.25,
    defaultViewport: null
}

const PROD_OPTIONS : object = {
    args: ['--no-sandbox']
}

export default async function getBrowser(){
    const isDev = process.env.NODE_ENV === "development";

    return await puppeteer.launch(isDev ? DEV_OPTIONS : PROD_OPTIONS);
}