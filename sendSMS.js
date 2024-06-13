import twilio from 'twilio';

const accountSid = 'ACf6b99f2fa295d00137eb6153bbadffa3';
const authToken = '5f98ac71bdcb08586a744b97de34f53e';
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
