import { getPageData, getPageBlocks, notionApi } from './pages.js';
import TodoGenerator from './gpt-todo.js'; // Import the TodoGenerator class
import Alert from './alert.js'; // Import the Alert class
import { reschedulePastEvents, listNotionPages, checkTasksAndAlerts } from './event-manager.js'; // Import the new function
import NotionDatabaseManager from './db-manager.js'; // Import the database manager

// Create and send TODO list
async function createTodoPage(apiKey, databaseId) {
  const todoGenerator = new TodoGenerator();
  await todoGenerator.createNotionPage(apiKey, databaseId);
  console.log("TODO list created successfully!");
}

// Create and send alert
async function createAlert(apiKey, databaseId) {
  const alertInstance = new Alert("Server Down", "The main server is down.", "Restart the server.", false);
  await alertInstance.sendAlert(apiKey, databaseId);
  console.log("Alert created, email sent, and SMS sent successfully!");
}

// Function to list all pages in a Notion parent page
async function listAllNotionPages(parentPageId) {
  try {
    const pages = await listNotionPages(parentPageId);
    console.log("Notion Pages:");
    pages.forEach(page => {
      if (page.type === 'child_page') {
        console.log(`- ${page.child_page.title}`);
      }
    });
  } catch (error) {
    console.error('Error listing Notion pages:', error);
  }
}

// Execute the functions
(async () => {
  const databaseManager = new NotionDatabaseManager();
  await databaseManager.ensureDatabaseExists(); // Ensure the database exists
  const databaseId = databaseManager.databaseId; // Get the database ID

  //await getPageData(notionApi.pageId);
  //await getPageBlocks(notionApi.pageId);
  //await createTodoPage(notionApi.key, databaseId);
  //await createAlert(notionApi.key, databaseId);
  //await reschedulePastEvents(); // Call the reschedule function
  //await listAllNotionPages(notionApi.pageId); // Call the function to list all Notion pages
  await checkTasksAndAlerts(databaseManager); // Check and alert for task acknowledgements and completions
})();
