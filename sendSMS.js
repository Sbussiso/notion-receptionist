import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function sendSMS(body, from, to) {
  try {
    const message = await client.messages.create({
      body: body,
      from: from,
      to: to,
    });
    console.log(message.sid);
    return "SMS sent successfully!";
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

export default sendSMS;
