import { getPageData, getPageBlocks, notionApi } from './pages.js';
import TodoGenerator from './gpt-todo.js'; // Import the TodoGenerator class
import Alert from './alert.js'; // Import the Alert class
import { reschedulePastEvents } from './event-manager.js'; // Import the reschedule function

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
  await getPageData(notionApi.pageId);
  await getPageBlocks(notionApi.pageId);
  await createTodoPage(notionApi.key, notionApi.pageId);
  await createAlert(notionApi.key, notionApi.pageId);
  await reschedulePastEvents(); // Call the reschedule function
})();
