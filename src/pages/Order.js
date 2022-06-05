"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const defaults_1 = require("../defaults");
const sleep_1 = __importDefault(require("../utils/sleep"));
const Balance_1 = __importDefault(require("./Balance"));
const BasePage_1 = __importDefault(require("./BasePage"));
class Order extends BasePage_1.default {
    constructor(browser, page, balance) {
        super(browser, page, defaults_1.SHUFERSAL_URL);
        this.balance = balance;
    }
    clickTile() {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield this.page.evaluate(({ selector, balance, balanceSelector, symbol }) => {
                try {
                    //@ts-ignore
                    const tiles = [...document.querySelectorAll(selector)].map(item => ({
                        element: item,
                        balance: parseFloat(item.querySelector(balanceSelector).innerText.replace(symbol, ""))
                    }));
                    console.log(tiles);
                    for (const tile of tiles) {
                        if (balance - tile.balance > 0) {
                            tile.element.click();
                            return true;
                        }
                    }
                    return false;
                }
                catch (e) {
                    console.error(e);
                    return false;
                }
            }, { selector: Order.TILE_DIV, balance: this.balance, balanceSelector: Order.TILE_PRICE_DIV, symbol: Balance_1.default.NIS_SYMBOL });
            return found;
        });
    }
    purchace() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.querySelector(Order.MODAl, "order modal");
            const addToCart = yield this.querySelector(Order.ADD_TO_CART_BTN, "add to cart button");
            yield addToCart.click();
            yield (0, sleep_1.default)(3000);
            const checkout = yield this.querySelector(Order.CHECKOUT_BTN, "checkout button");
            // await checkout.click();
        });
    }
    buy() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.navigate();
            yield this.querySelector(Order.TILE_PRICE_DIV, "order tiles");
            const found = yield this.clickTile();
            if (!found) {
                return true;
            }
            else {
                yield this.purchace();
                yield (0, sleep_1.default)(50000);
                return false;
            }
        });
    }
}
exports.default = Order;
Order.TILE_DIV = "div[class*='MenuBodyDishList__Item'] button";
Order.TILE_PRICE_DIV = "div[id*='dishPrice_']";
Order.MODAl = '[data-test-id="rootModal"]';
Order.ADD_TO_CART_BTN = '[data-test-id="submitDishBtn"]';
Order.CHECKOUT_BTN = '[data-test-id="proceedToCheckoutBtn"]';
