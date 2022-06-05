import { Browser, Page } from "puppeteer";
import { SHUFERSAL_URL } from "../defaults";
import sleep from "../utils/sleep";
import Balance from "./Balance";
import BasePage from "./BasePage";

export default class Order extends BasePage{
    private balance: number;

    static TILE_DIV = "div[class*='MenuBodyDishList__Item'] button";
    static TILE_PRICE_DIV = "div[id*='dishPrice_']";
    static MODAl = '[data-test-id="rootModal"]'
    static ADD_TO_CART_BTN = '[data-test-id="submitDishBtn"]';
    static CHECKOUT_BTN = '[data-test-id="proceedToCheckoutBtn"]';

    constructor(browser: Browser, page: Page, balance: number){
        super(browser, page, SHUFERSAL_URL);
        this.balance = balance;
    }

    async clickTile(){
        const found = await this.page.evaluate(({selector, balance, balanceSelector, symbol}) => {
            try{
                //@ts-ignore
                const tiles = [...document.querySelectorAll(selector)].map(item => ({
                    element: item,
                    balance: parseFloat(item.querySelector(balanceSelector).innerText.replace(symbol,""))
                }))
    
                console.log(tiles);
    
                for (const tile of tiles){
                    if(balance - tile.balance > 0){
                        tile.element.click();
    
                        return true;
                    }
                }
    
                return false;
            } catch(e){
                console.error(e);

                return false;
            }

        }, {selector:Order.TILE_DIV, balance: this.balance, balanceSelector: Order.TILE_PRICE_DIV, symbol : Balance.NIS_SYMBOL})

        return found as boolean;
    }

    async purchace(){
        await this.querySelector(Order.MODAl, "order modal");

        const addToCart = await this.querySelector(Order.ADD_TO_CART_BTN,"add to cart button");
        await addToCart.click()

        await sleep(3000);

        const checkout = await this.querySelector(Order.CHECKOUT_BTN, "checkout button");
        // await checkout.click();
    }

    async buy(){
        await this.navigate();
        await this.querySelector(Order.TILE_PRICE_DIV, "order tiles");

        const found = await this.clickTile();
        if(!found){
            return true
        } else{
            await this.purchace();

            await sleep(50000);

            return false;
        }
    }
}