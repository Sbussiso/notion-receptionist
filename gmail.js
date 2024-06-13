import { google } from 'googleapis';
import readline from 'readline';
import fs from 'fs';
import path from 'path';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');

// Load client secrets from a local file.
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content), main);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {function} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Main function to send an email and list emails.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function main(auth) {
  sendEmail(auth);
  listMessages(auth);
}

/**
 * Send an email using the Gmail API.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function sendEmail(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  const email = [
    'Content-Type: text/plain; charset="UTF-8"\n',
    'MIME-Version: 1.0\n',
    'Content-Transfer-Encoding: 7bit\n',
    'to: sbussiso321@gmail.com\n',
    'from: sbussiso321@gmail.com\n',
    'subject: Notion Assistant Alert System\n\n',
    'This is a test email sent from the Gmail API using Node.js!'
  ].join('');

  const encodedMessage = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  gmail.users.messages.send({
    userId: 'me',
    resource: {
      raw: encodedMessage,
    }
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    console.log('Email sent:', res.data);
  });
}

/**
 * Lists the first 10 messages in the user's inbox.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listMessages(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  gmail.users.messages.list(
    {
      userId: 'me',
      maxResults: 10,
    },
    (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const messages = res.data.messages;
      if (messages && messages.length) {
        console.log('Messages:');
        messages.forEach((message) => {
          gmail.users.messages.get({
            userId: 'me',
            id: message.id,
          }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const headers = res.data.payload.headers;
            const fromHeader = headers.find(header => header.name === 'From');
            const sender = fromHeader ? fromHeader.value : 'Unknown sender';

            if (!fromHeader) {
              console.log(`- ${message.id}: Unknown sender (Headers: ${JSON.stringify(headers)})`);
              console.log();
            } else {
              console.log(`- ${message.id}: ${sender}`);
              console.log();
            }
          });
        });
      } else {
        console.log('No messages found.');
      }
    }
  );
}

