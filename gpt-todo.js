import OpenAI from 'openai';
import axios from 'axios';  // Import axios
import GmailClient from './g-client.js'; // Import GmailClient

const openai = new OpenAI({
  apiKey: 'sk-proj-w0Cu7DodOPSJYnpbPVs9T3BlbkFJz1Hmy1roYNOwO4v6taiT'
});

class TodoGenerator {
  async getCalendarData() {
    const gmailClient = new GmailClient();
    await gmailClient.initialize();
    const events = await gmailClient.listEvents();
    return events.map(event => `${event.start.dateTime || event.start.date} - ${event.summary}`).join('\n');
  }

  async getTodoList() {
    const calendarData = await this.getCalendarData();


    const format = `Write a TODO list for today in the following format FORMAT:
                    FORMAT:
                    [] item
                    (general advice)
                        - break down into steps
                    [] item
                    (general advice)
                        - break down into steps
                    [] item
                    (general advice)
                        - break down into steps`;

    const completion = await openai.chat.completions.create({
      //model: 'gpt-4o',
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `Plan the users day based on priority: Google calendar data: ${calendarData}` },
        { role: 'user', content: format }
      ]
    });
    return completion.choices[0].message.content;
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

    const todoContent = await this.getTodoList();

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
              content: 'TODO: ' + formattedDateTime // Replace with your desired page title
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
                  content: todoContent // Replace with the TODO list content from GPT-3
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
}

export default TodoGenerator;
