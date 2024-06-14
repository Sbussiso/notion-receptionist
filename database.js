import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const notionApiKey = process.env.NOTION_API_KEY;
const parentPageId = process.env.NOTION_PARENT_PAGE_ID;

const notion = axios.create({
  baseURL: 'https://api.notion.com/v1/',
  headers: {
    'Authorization': `Bearer ${notionApiKey}`,
    'Notion-Version': '2022-06-28', // Ensure the correct API version
  },
});

async function checkDatabaseExists(databaseId) {
  try {
    const response = await notion.get(`databases/${databaseId}`);
    console.log('Database exists:', response.data);
    return true;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('Database does not exist.');
      return false;
    } else {
      console.error('Error checking database existence:', error);
      throw error;
    }
  }
}

async function createDatabase() {
  try {
    const response = await notion.post('databases', {
      parent: { type: 'page_id', page_id: parentPageId },
      title: [
        {
          type: 'text',
          text: {
            content: 'My New Database'
          }
        }
      ],
      properties: {
        Name: {
          title: {}
        },
        Description: {
          rich_text: {}
        },
        Date: {
          date: {}
        }
      }
    });

    console.log('Database created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating database:', error.response ? error.response.data : error);
    throw error;
  }
}

async function ensureDatabaseExists(databaseId) {
  if (!databaseId || databaseId === 'your_database_id') {
    console.log('No database ID provided, creating a new database...');
    await createDatabase();
  } else {
    const exists = await checkDatabaseExists(databaseId);
    if (!exists) {
      console.log('Database does not exist, creating one now...');
      await createDatabase();
    }
  }
}

// Replace 'your_database_id' with a valid database ID or leave it empty to create a new database
const databaseId = '25749ed982594014978e424f15e8a0f5'; // Replace this with the actual ID if you have one, or leave it as 'your_database_id' for testing

ensureDatabaseExists(databaseId);
