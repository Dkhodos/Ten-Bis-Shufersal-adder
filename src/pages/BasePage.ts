import { Browser, ElementHandle, Page } from "puppeteer";
import { GLOBAL_TIMEOUT, MAIN_URL } from "../defaults";

export default abstract class BasePage{
    protected page: Page;
    protected browser: Browser;
    protected navigateURL: string;

    static TIMEOUT_OPTIONS = {
        timeout: GLOBAL_TIMEOUT
    }

    constructor(browser: Browser, page: Page, url?: string){
        this.page = page;
        this.browser = browser;
        this.navigateURL = url ?? MAIN_URL
    }

    protected notFound(name: string){
        return new Error(`${name} not found!, after waiting ${BasePage.TIMEOUT_OPTIONS.timeout}`);
    }

    protected async navigate(){
        return await this.page.goto(this.navigateURL);
    }

    protected async querySelector(selector: string, name: string): Promise<ElementHandle<Element>>{
        const element = await this.page.waitForSelector(selector, BasePage.TIMEOUT_OPTIONS);
        if(!element){
            throw this.notFound(name);
        }

        return element;
    }
}