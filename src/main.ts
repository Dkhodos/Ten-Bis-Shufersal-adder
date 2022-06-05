import puppeteer from 'puppeteer';
import 'dotenv/config'
import express from "express";
import Login from './pages/Login';
import sleep from './utils/sleep';
import { savePasscode, getPasscode } from './utils/passCodeManager';
import Balance from './pages/Balance';
import Order from './pages/Order';
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

async function runPuppeteer(){
    const browser = await puppeteer.launch({headless: false, slowMo: 0.25, defaultViewport: null});
    const page = await browser.newPage();

    const login = new Login(browser, page);
    await login.play();

    const balancePage = new Balance(browser,page);
    let done = false;
    while(!done){
        const balance = await balancePage.getBalance();

        const order = new Order(browser, page, balance);
        done = await order.buy();
    }

    await sleep(100000);
    await browser.close();
}

app.post("/passcode", ( req, res ) => {
    const passcode = req.body.passcode;

    savePasscode(passcode);

    res.json({
        status: "OK!",
        passcode: getPasscode()
    });
});

app.delete("/passcode",  (req, res)  => {
    savePasscode("");

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
    })
})

const port = process.env.PORT ?? 8080;
app.listen( port, () => {
    console.log(`listening to  http://localhost:${port}/`)
});