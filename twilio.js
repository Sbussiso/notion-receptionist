// Import the Twilio client using ES module syntax
import twilio from 'twilio';

// Your AccountSID and Auth Token from console.twilio.com
const accountSid = 'ACf6b99f2fa295d00137eb6153bbadffa3';
const authToken = '5f98ac71bdcb08586a744b97de34f53e';

const client = twilio(accountSid, authToken);

client.messages
  .create({
    body: 'Hello from twilio-node',
    to: '+13602806070', // Text your number
    from: '+13606340818', // From a valid Twilio number
  })
  .then((message) => console.log(message.sid))
  .catch((error) => console.error('Error sending message:', error));
