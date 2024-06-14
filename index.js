import axios from 'axios';
import TodoGenerator from './gpt-todo.js'; // Import the TodoGenerator class
import Alert from './alert.js'; // Import the Alert class

// Replace with your Notion API key
const notionApiKey = 'secret_mQ545sMhgR8c4yrEZn5x5JUboc1mzxibO9Nzy02F8CB';

// Replace with the Notion page ID you want to use
const pageId = '600586222a744448b3360d7c43ba9593';

// Set up Axios instance with Notion API key
const notion = axios.create({
  baseURL: 'https://api.notion.com/v1/',
  headers: {
    'Authorization': `Bearer ${notionApiKey}`,
    'Notion-Version': '2022-06-28', // Make sure to use the correct Notion API version
  },
});

// Function to retrieve data from a Notion page
async function getPageData(pageId) {
  try {
    const response = await notion.get(`pages/${pageId}`);
    console.log('Page title:', response.data.properties.title.title[0].plain_text);
  } catch (error) {
    console.error('Error fetching page data:', error);
  }
}

// Function to parse blocks and display content
function parseBlocks(blocks) {
  blocks.forEach(block => {
    if (block[block.type] && block[block.type].rich_text) {
      const content = block[block.type].rich_text.map(text => text.plain_text).join(' ');
      console.log(content);
    }
  });
}

// Function to retrieve blocks from a Notion page
async function getPageBlocks(pageId) {
  try {
    const response = await notion.get(`blocks/${pageId}/children`);
    const blocks = response.data.results;
    parseBlocks(blocks);
    
  } catch (error) {
    console.error('Error fetching page blocks:', error);
  }
}

// Create and send TODO list
async function createTodoPage(apiKey, pageId) {
  const todoGenerator = new TodoGenerator();
  await todoGenerator.createNotionPage(apiKey, pageId);
  console.log("TODO list created successfully!");
}

// Create and send alert
async function createAlert(apiKey, pageId) {
  const alertInstance = new Alert("Server Down", "The main server is down.", "Restart the server.", false);
  await alertInstance.sendEmail();
  await alertInstance.createNotionPage(apiKey, pageId);
  await alertInstance.sendSMSMessage();
  console.log("Alert created, email sent, and SMS sent successfully!");
}

// Execute the functions
(async () => {
  await getPageData(pageId);
  await getPageBlocks(pageId);
  await createTodoPage(notionApiKey, pageId);
  //await createAlert(notionApiKey, pageId);
})();
