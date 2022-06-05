import { Browser, Page } from "puppeteer";
import { GLOBAL_TIMEOUT, LOGIN_URL} from "../defaults";
import { fetchPasscode } from "../utils/passCodeManager";
import sleep from "../utils/sleep";
import BasePage from "./BasePage";


export default class Login extends BasePage{
    private username: string;

    static EMAIL_INPUT = 'input[name="email"]';
    static PROCEED_TO_PASSWORD_BTN = '[data-test="login-submit"]';
    static PASSCODE_INPUT= 'input[name="authenticationCode"]';
    static SUBMIT_BTN = "#login_tab_controls button[type='submit']";

    static TIMEOUT_OPTIONS = {
        timeout: GLOBAL_TIMEOUT
    }

    constructor(browser: Browser, page: Page){
        super(browser, page, LOGIN_URL);
        this.username = process.env.USERNAME as string;
    }

    private async insertLogin(){
        const emailInput = await this.querySelector(Login.EMAIL_INPUT, "email input");
        await emailInput.type(this.username);

        const proceedBtn = await this.querySelector(Login.PROCEED_TO_PASSWORD_BTN, "proceed button");
        await proceedBtn.click();

        const passcode = await fetchPasscode();
        if(!passcode){
            throw new Error("passcode missing!!");
        }
        
        const passcodeInput = await this.querySelector(Login.PASSCODE_INPUT,"passcode input");
        await passcodeInput.type(passcode);
        
        const submitBtn = await this.querySelector(Login.SUBMIT_BTN,"submit button");
        await submitBtn.click();
    }

    async isNotLoginPage(){
        return await this.page.evaluate(() => !window.location.href.includes("singin"));
    }

    async play(){
        let good = false;
        let tries = 5;
        while(!good){
            await this.navigate();
            await this.insertLogin();
            await sleep(5000);
            good = await this.isNotLoginPage();

            if (--tries === 0 && !good){
                throw new Error("Failed to login after many tries");
            }
        }
    }
}