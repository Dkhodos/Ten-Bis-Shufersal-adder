import { Browser } from 'puppeteer';
import 'dotenv/config'
import express from "express";
import Login from './pages/Login';
import sleep from './utils/sleep';
import { savePasscode } from './utils/passCodeManager';
import Balance from './pages/Balance';
import Order from './pages/Order';
import cors from "cors";
import MessageClient from './twilio/MessageClient';
import getBrowser from './utils/getBrowser';
import initChromium from './utils/initChromium';

const app = express();
app.use(express.json());
app.use(cors());

async function runPuppeteer(browser: Browser){
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
    const passcode = req.body;

    savePasscode(passcode);

    new MessageClient().send("Thanks!, recived " + passcode);

    res.json({
        status: "OK!",
        passcode
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
    (async() => {
        const browser = await getBrowser();

        try{
            await runPuppeteer(browser);
        } catch(e){
            await browser.close();
            throw new Error(e);
        }
    })()

    res.json({
        status: "OK!",
        puppeteer: "running!"
    })
})

const port = process.env.PORT ?? 8080;
app.listen( port, () => {
    console.log(`listening to http://localhost:${port}/`);

    initChromium().then(version => {
        console.log(`running ${version}/puppeteer`);
    })
});