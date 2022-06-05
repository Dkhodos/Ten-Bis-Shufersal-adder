const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const myNumber = process.env.PHONE_NUMBER;

import twilio from "twilio";

export default class MessageClient{
    private client: twilio.Twilio;

    constructor(){
        this.client = twilio(accountSid, authToken);
    }

    send(message: string){
        return this.client.messages.create({
         from: `whatsapp:${twilioNumber}`,
         body: message,
         to: `whatsapp:${myNumber}`
       });
    }
}