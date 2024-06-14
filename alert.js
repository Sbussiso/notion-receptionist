import axios from 'axios';
import GmailClient from './g-client.js'; // Adjust the path as needed
import sendSMS from './sendSMS.js'; // Import the sendSMS function

class Alert {
  constructor(alert, description, resolution, resolved) {
    this.alert = alert;
    this.description = description;
    this.resolution = resolution;
    this.resolved = resolved;
    this.gmailClient = new GmailClient();
  }

  getAlerts() {
    const alertDetails = `
      Alert:
      ${this.alert}\n
      Description:\n
      ${this.description}\n
      Possible Resolution:\n
      ${this.resolution}\n
      Resolved: ${this.resolved}\n
    `;
    return alertDetails;
  }

  async createNotionPage(apiKey, databaseId) {
    const formattedDateTime = new Date().toLocaleString();
    const notion = axios.create({
      baseURL: 'https://api.notion.com/v1/',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
      },
    });

    const alertContent = this.getAlerts();

    const newPageData = {
      parent: {
        type: 'database_id',
        database_id: databaseId, // Use database ID instead of page ID
      },
      properties: {
        Task: {
          title: [
            {
              text: {
                content: 'ALERT: ' + formattedDateTime, // Replace with your desired page title
              },
            },
          ],
        },
        Acknowledge: {
          checkbox: false,
        },
        Completed: {
          checkbox: false,
        },
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: alertContent, // Replace with alert content
                },
              },
            ],
          },
        },
      ],
    };

    console.log('Creating Notion page with data:', JSON.stringify(newPageData, null, 2));

    try {
      const response = await notion.post('pages', newPageData);
      console.log('Page created:', response.data);
    } catch (error) {
      console.error('Error creating page:', error.response ? error.response.data : error.message);
    }
  }

  async sendEmail() {
    await this.gmailClient.initialize();
    const alertContent = this.getAlerts();
    const emailContent = [
      'Content-Type: text/plain; charset="UTF-8"\n',
      'MIME-Version: 1.0\n',
      'Content-Transfer-Encoding: 7bit\n',
      'to: sbussiso321@gmail.com\n',  // Replace with the actual recipient email
      'from: sbussiso321@gmail.com\n',  // Replace with the actual sender email
      'subject: Notion Assistant Alert System\n\n',
      alertContent
    ].join('');

    await this.gmailClient.sendEmail(emailContent);
  }

  async sendSMSMessage() {
    const alertContent = this.getAlerts();
    const smsBody = `ALERT: ${this.alert}\nDescription: ${this.description}\nResolution: ${this.resolution}\nResolved: ${this.resolved}`;
    console.log('Sending SMS with body:', smsBody);
    try {
      await sendSMS(smsBody, 'whatsapp:+14155238886', 'whatsapp:+13602806070'); // Replace with actual sender and recipient numbers
      console.log('SMS sent successfully');
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  }
}

export default Alert;
