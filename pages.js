import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Replace with your Notion API key
const notionApiKey = process.env.NOTION_API_KEY;

// Replace with the Notion page ID you want to use
const pageId = process.env.NOTION_PARENT_PAGE_ID;

// Set up Axios instance with Notion API key
const notion = axios.create({
  baseURL: 'https://api.notion.com/v1/',
  headers: {
    'Authorization': `Bearer ${notionApiKey}`,
    'Notion-Version': '2022-06-28', // Make sure to use the correct Notion API version
  },
});

// Function to retrieve data from a Notion page
export async function getPageData(pageId) {
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
export async function getPageBlocks(pageId) {
  try {
    const response = await notion.get(`blocks/${pageId}/children`);
    const blocks = response.data.results;
    parseBlocks(blocks);
  } catch (error) {
    console.error('Error fetching page blocks:', error);
  }
}

// Export Notion API key and page ID for reuse
export const notionApi = {
  key: notionApiKey,
  pageId: pageId
};
