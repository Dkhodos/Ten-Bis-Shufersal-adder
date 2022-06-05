import { Browser, Page } from "puppeteer";
import { BALANCE_URL } from "../defaults";
import BasePage from "./BasePage";

export default class Balance extends BasePage{
    static BALANCE_DIV = 'div[type="balance"]';
    static NIS_SYMBOL = '₪';

    constructor(browser: Browser, page: Page){
        super(browser, page, BALANCE_URL);
    }

    private async findBalance(){
        const balance = await this.querySelector(Balance.BALANCE_DIV, "balance div");

        return await this.page.evaluate(el => el.innerText, balance) as string
    }

    async getBalance(): Promise<number>{
        await this.navigate();

        const balance = await this.findBalance();
        if(!balance){
            throw new Error("balance element not found!")
        }

        return parseFloat(balance.replace(Balance.NIS_SYMBOL, ""));
    }
}