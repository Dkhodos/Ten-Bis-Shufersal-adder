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
Object.defineProperty(exports, "__esModule", { value: true });
const defaults_1 = require("../defaults");
class BasePage {
    constructor(browser, page, url) {
        this.page = page;
        this.browser = browser;
        this.navigateURL = url !== null && url !== void 0 ? url : defaults_1.MAIN_URL;
    }
    notFound(name) {
        return new Error(`${name} not found!, after waiting ${BasePage.TIMEOUT_OPTIONS.timeout}`);
    }
    navigate() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.page.goto(this.navigateURL);
        });
    }
    querySelector(selector, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const element = yield this.page.waitForSelector(selector, BasePage.TIMEOUT_OPTIONS);
            if (!element) {
                throw this.notFound(name);
            }
            return element;
        });
    }
}
exports.default = BasePage;
BasePage.TIMEOUT_OPTIONS = {
    timeout: defaults_1.GLOBAL_TIMEOUT
};
