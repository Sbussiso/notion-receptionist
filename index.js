import axios from 'axios';
import getTodoList from './gpt-todo.js'; // Import the getTodoList function
import Alert from './page-alerts.js';

// Replace with your Notion API key
const notionApiKey = 'secret_mQ545sMhgR8c4yrEZn5x5JUboc1mzxibO9Nzy02F8CB';

// Replace with the Notion page ID you want to retrieve data from
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

// Call the function to get page data
getPageData(pageId);

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

// Call the function to get page blocks
getPageBlocks(pageId);

// Function to get current date and time in default format
function getFormattedDateTime() {
  const now = new Date();
  return now.toLocaleString();
}

// Function to create a new page in Notion
async function createPageTodo() {
  const formattedDateTime = getFormattedDateTime();
  console.log('Current Date and Time:', formattedDateTime);

  // Fetch TODO list from GPT-3
  const todoContent = await getTodoList();

  const newPageData = {
    parent: { 
      type: 'page_id', 
      page_id: '600586222a744448b3360d7c43ba9593' // Replace with the ID of the parent page or database
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

// Call the function to create a new page
createPageTodo(); //!WORKS!
console.log("TODO list created successfully!");




//TODO: Handle email and phone notifications
// Create an instance of Alert and create a page in Notion
const alertInstance = new Alert("Server Down", "The main server is down.", "Restart the server.", false);
alertInstance.createNotionPage(notionApiKey, pageId);
console.log("Alert created successfully!");
