import { getPageData, getPageBlocks, createNotionPage, notionApi } from './pages.js';
import TodoGenerator from './gpt-todo.js'; // Import the TodoGenerator class
import Alert from './alert.js'; // Import the Alert class
import { reschedulePastEvents, listNotionPages, checkTasksAndAlerts } from './event-manager.js'; // Import the new function
import NotionDatabaseManager from './db-manager.js'; // Import the database manager
import NotionEmailsDatabaseManager from './emails-db-manager.js'; // Import the emails database manager

// Create and send TODO list
async function createTodoPage(apiKey, databaseId, name) {
  const todoGenerator = new TodoGenerator();
  const todoContent = await todoGenerator.getTodoList();
  await createNotionPage(todoContent, name);
  console.log("TODO list created successfully!");
}

async function createEmailSummaryPage(apiKey, databaseId, name) {
  const todoGenerator = new TodoGenerator();
  const emailSnapshot = await todoGenerator.getEmailSnapshot();
  console.log(emailSnapshot);
  await createNotionPage(emailSnapshot, name);
  console.log("Email summary created successfully!");
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

// Function to check and alert for task acknowledgements and completions
async function checkEmailsAndAlerts(emailsDatabaseManager) {
  try {
    const emails = await emailsDatabaseManager.getAllEmails(); // Assumes a function to get all emails
    for (const email of emails) {
      // Implement email-specific checks and alerts
      // Example: await checkEmailAcknowledgement(email);
      // Example: await checkEmailCompletion(email, emailsDatabaseManager);
    }
  } catch (error) {
    console.error('Error checking emails and alerts:', error);
  }
}

// Execute the functions
(async () => {
  const databaseManager = new NotionDatabaseManager();
  await databaseManager.ensureDatabaseExists(); // Ensure the database exists
  const databaseId = databaseManager.databaseId; // Get the database ID

  const emailsDatabaseManager = new NotionEmailsDatabaseManager();
  await emailsDatabaseManager.ensureDatabaseExists(); // Ensure the Emails database exists
  const emailsDatabaseId = emailsDatabaseManager.databaseId; // Get the Emails database ID

  //await createTodoPage(notionApi.key, databaseId, "TODO");
  //await createEmailSummaryPage(notionApi.key, emailsDatabaseId, "Email Snapshot");
  //await createAlert(notionApi.key, databaseId);
  //await reschedulePastEvents(); // Call the reschedule function
  //await listAllNotionPages(notionApi.pageId); // Call the function to list all Notion pages
  await checkTasksAndAlerts(databaseManager); // Check and alert for task acknowledgements and completions
  await checkEmailsAndAlerts(emailsDatabaseManager); // Check and alert for email actions
})();
