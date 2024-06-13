import OpenAI from 'openai';
import axios from 'axios';  // Import axios

const openai = new OpenAI({
    apiKey: 'sk-proj-w0Cu7DodOPSJYnpbPVs9T3BlbkFJz1Hmy1roYNOwO4v6taiT'
});

class TodoGenerator {
    async getTodoList() {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'write a TODO list for me. \n FORMAT: \n[] item\n [] item\n [] item' }
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
