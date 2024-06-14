import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

const notionApiKey = process.env.NOTION_API_KEY;
const parentPageId = process.env.NOTION_PARENT_PAGE_ID;
let databaseId = process.env.NOTION_DATABASE_ID;

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
    return response.data.id;  // Return the new database ID
  } catch (error) {
    console.error('Error creating database:', error.response ? error.response.data : error);
    throw error;
  }
}

async function updateEnvFile(newDatabaseId) {
  try {
    const envFile = await fs.readFile('.env', 'utf-8');
    const envLines = envFile.split('\n');
    const updatedEnvLines = envLines.map(line => {
      if (line.startsWith('NOTION_DATABASE_ID=')) {
        return `NOTION_DATABASE_ID=${newDatabaseId}`;
      }
      return line;
    });

    if (!envLines.some(line => line.startsWith('NOTION_DATABASE_ID='))) {
      updatedEnvLines.push(`NOTION_DATABASE_ID=${newDatabaseId}`);
    }

    await fs.writeFile('.env', updatedEnvLines.join('\n'));
    console.log('Updated .env file with new database ID');
  } catch (error) {
    console.error('Error updating .env file:', error);
    throw error;
  }
}

async function ensureDatabaseExists(databaseId) {
  let validDatabaseId = false;

  if (databaseId && databaseId !== 'your_database_id') {
    try {
      validDatabaseId = await checkDatabaseExists(databaseId);
    } catch (error) {
      console.log('Invalid database ID, creating a new database...');
    }
  }

  if (!validDatabaseId) {
    console.log('No valid database ID provided or database does not exist, creating a new database...');
    const newDatabaseId = await createDatabase();
    await updateEnvFile(newDatabaseId);
  }
}

ensureDatabaseExists(databaseId);
