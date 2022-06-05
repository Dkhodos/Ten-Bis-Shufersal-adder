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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const Login_1 = __importDefault(require("./pages/Login"));
const sleep_1 = __importDefault(require("./utils/sleep"));
const passCodeManager_1 = require("./utils/passCodeManager");
const Balance_1 = __importDefault(require("./pages/Balance"));
const Order_1 = __importDefault(require("./pages/Order"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
function runPuppeteer() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch({ headless: false, slowMo: 0.25, defaultViewport: null });
        const page = yield browser.newPage();
        const login = new Login_1.default(browser, page);
        yield login.play();
        const balancePage = new Balance_1.default(browser, page);
        let done = false;
        while (!done) {
            const balance = yield balancePage.getBalance();
            const order = new Order_1.default(browser, page, balance);
            done = yield order.buy();
        }
        yield (0, sleep_1.default)(100000);
        yield browser.close();
    });
}
app.post("/passcode", (req, res) => {
    const passcode = req.body.passcode;
    (0, passCodeManager_1.savePasscode)(passcode);
    res.json({
        status: "OK!",
        passcode: (0, passCodeManager_1.getPasscode)()
    });
});
app.delete("/passcode", (req, res) => {
    (0, passCodeManager_1.savePasscode)("");
    res.json({
        status: "OK!",
        passcode: "deleted!"
    });
});
app.get("/", (req, res) => {
    runPuppeteer().catch(e => {
        throw new Error(e);
    });
    console.log("running pupetter");
    res.json({
        status: "OK!",
        puppeteer: "running!"
    });
});
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8080;
app.listen(port, () => {
    console.log(`listening to  http://localhost:${port}/`);
});
