import axios from 'axios';
import GmailClient from './gmail.js'; // Adjust the path as needed

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

    async createNotionPage(apiKey, pageId) {
        const formattedDateTime = new Date().toLocaleString();
        const notion = axios.create({
            baseURL: 'https://api.notion.com/v1/',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
            },
        });

        const alertContent = this.getAlerts();

        const newPageData = {
            parent: { 
                type: 'page_id', 
                page_id: pageId // Replace with the ID of the parent page or database
            },
            properties: {
                title: [
                    {
                        type: 'text',
                        text: {
                            content: 'ALERT: ' + formattedDateTime // Replace with your desired page title
                        }
                    }
                ]
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
                                    content: alertContent // Replace with alert content
                                }
                            }
                        ]
                    }
                }
            ]
        };

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
}

export default Alert;
