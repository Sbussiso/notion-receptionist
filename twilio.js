import twilio from 'twilio';

const accountSid = 'ACf6b99f2fa295d00137eb6153bbadffa3';
const authToken = '5f98ac71bdcb08586a744b97de34f53e';
const client = twilio(accountSid, authToken);

async function sendSMS() {
  client.messages
    .create({
        body: 'Your appointment is coming up on July 21 at 3PM',
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+13602806070'
    })
    .then(message => console.log(message.sid))

    return "SMS sent successfully!";

}

export default sendSMS;