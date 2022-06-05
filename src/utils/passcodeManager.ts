import MessageClient from "../twilio/MessageClient";
import sleep from "./sleep";

const INTERVAL = 1000;
const TRIES = 45 * 60;

export function savePasscode(text: string){
    (global as any).passcode = text || undefined;
}

export function getPasscode(){
    return (global as any).passcode as string | undefined;
}

export async function fetchPasscode(): Promise<string>{
    let tries = TRIES;

    await new MessageClient().send("Hey, You recived a passcode, may I get it :3 ?")

    while(tries > 0){
        const passcode = getPasscode();
        if(passcode){
            savePasscode("");

            return passcode;
        }
        await sleep(1000);
        tries--;
    }

    return "";
}