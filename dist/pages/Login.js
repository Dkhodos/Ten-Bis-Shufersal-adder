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
const passCodeManager_1 = require("../utils/passCodeManager");
const sleep_1 = __importDefault(require("../utils/sleep"));
const BasePage_1 = __importDefault(require("./BasePage"));
class Login extends BasePage_1.default {
    constructor(browser, page) {
        super(browser, page, defaults_1.LOGIN_URL);
        this.username = process.env.USERNAME;
        this.password = process.env.PASSWORD;
    }
    insertLogin() {
        return __awaiter(this, void 0, void 0, function* () {
            const emailInput = yield this.querySelector(Login.EMAIL_INPUT, "email input");
            yield emailInput.type(this.username);
            const proceedBtn = yield this.querySelector(Login.PROCEED_TO_PASSWORD_BTN, "proceed button");
            yield proceedBtn.click();
            const passcode = yield (0, passCodeManager_1.fetchPasscode)();
            if (!passcode) {
                throw new Error("passcode missing!!");
            }
            const passcodeInput = yield this.querySelector(Login.PASSCODE_INPUT, "passcode input");
            yield passcodeInput.type(passcode);
            const submitBtn = yield this.querySelector(Login.SUBMIT_BTN, "submit button");
            yield submitBtn.click();
        });
    }
    isNotLoginPage() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.page.evaluate(() => !window.location.href.includes("singin"));
        });
    }
    play() {
        return __awaiter(this, void 0, void 0, function* () {
            let good = false;
            let tries = 5;
            while (!good) {
                yield this.navigate();
                yield this.insertLogin();
                yield (0, sleep_1.default)(5000);
                good = yield this.isNotLoginPage();
                if (--tries === 0 && !good) {
                    throw new Error("Failed to login after many tries");
                }
            }
        });
    }
}
exports.default = Login;
Login.EMAIL_INPUT = 'input[name="email"]';
Login.PROCEED_TO_PASSWORD_BTN = '[data-test="login-submit"]';
Login.PASSCODE_INPUT = 'input[name="authenticationCode"]';
Login.SUBMIT_BTN = "#login_tab_controls button[type='submit']";
Login.TIMEOUT_OPTIONS = {
    timeout: defaults_1.GLOBAL_TIMEOUT
};
//# sourceMappingURL=Login.js.map