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
const BasePage_1 = __importDefault(require("./BasePage"));
class Balance extends BasePage_1.default {
    constructor(browser, page) {
        super(browser, page, defaults_1.BALANCE_URL);
    }
    findBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.querySelector(Balance.BALANCE_DIV, "balance div");
            return yield this.page.evaluate(el => el.innerText, balance);
        });
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.navigate();
            const balance = yield this.findBalance();
            if (!balance) {
                throw new Error("balance element not found!");
            }
            return parseFloat(balance.replace(Balance.NIS_SYMBOL, ""));
        });
    }
}
exports.default = Balance;
Balance.BALANCE_DIV = 'div[type="balance"]';
Balance.NIS_SYMBOL = '₪';
