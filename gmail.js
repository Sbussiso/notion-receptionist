import { google } from 'googleapis';
import readline from 'readline';
import fs from 'fs';
import path from 'path';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

class GmailClient {
  constructor() {
    this.oAuth2Client = null;
  }

  async initialize() {
    const content = await fs.promises.readFile(CREDENTIALS_PATH, 'utf8');
    const credentials = JSON.parse(content);
    await this.authorize(credentials);
  }

  async authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    try {
      const token = await fs.promises.readFile(TOKEN_PATH, 'utf8');
      this.oAuth2Client.setCredentials(JSON.parse(token));
    } catch (err) {
      await this.getNewToken();
    }
  }

  async getNewToken() {
    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const code = await new Promise((resolve) => {
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        resolve(code);
      });
    });

    const { tokens } = await this.oAuth2Client.getToken(code);
    this.oAuth2Client.setCredentials(tokens);
    await fs.promises.writeFile(TOKEN_PATH, JSON.stringify(tokens));
    console.log('Token stored to', TOKEN_PATH);
  }

  async sendEmail(emailContent) {
    const gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });

    const encodedMessage = Buffer.from(emailContent).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    try {
      const res = await gmail.users.messages.send({
        userId: 'me',
        resource: {
          raw: encodedMessage,
        },
      });
      console.log('Email sent:', res.data);
    } catch (err) {
      console.log('The API returned an error:', err);
    }
  }

  async listMessages() {
    const gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });

    try {
      const res = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 10,
      });
      const messages = res.data.messages;
      if (messages && messages.length) {
        console.log('Messages:');
        for (const message of messages) {
          const messageRes = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
          });
          const headers = messageRes.data.payload.headers;
          const fromHeader = headers.find(header => header.name === 'From');
          const sender = fromHeader ? fromHeader.value : 'Unknown sender';
          console.log(`- ${message.id}: ${sender}`);
        }
      } else {
        console.log('No messages found.');
      }
    } catch (err) {
      console.log('The API returned an error:', err);
    }
  }
}

export default GmailClient;
