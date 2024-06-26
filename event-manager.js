import GmailClient from './g-client.js';
import Alert from './alert.js';
import { notionApi } from './pages.js';
import NotionDatabaseManager from './db-manager.js';

// Function to list all child pages under a Notion parent page
async function listNotionPages(parentPageId) {
  try {
    const response = await fetch(`https://api.notion.com/v1/blocks/${parentPageId}/children`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${notionApi.key}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28' // Ensure the correct API version
      }
    });

    // Log response for debugging
    console.log('Notion API response status:', response.status);

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error response from Notion API:', errorResponse);
      throw new Error('Failed to fetch Notion pages');
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error in listNotionPages:', error);
    throw error;
  }
}

// Updates events in the calendar by moving expired events to the next future day
async function reschedulePastEvents() {
  const gmailClient = new GmailClient();
  await gmailClient.initialize();

  try {
    const pastEvents = await gmailClient.listPastEvents();
    const now = new Date();

    for (const event of pastEvents) {
      // Extract event details
      const { id, summary, location, description, start, end, attendees, reminders } = event;

      // Delete the past event
      await gmailClient.deleteEvent(id);
      console.log(`Deleted past event: ${summary}`);

      // Calculate new start and end dates (1 day from now for simplicity)
      const newStartDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const newEndDate = new Date(newStartDate.getTime() + (new Date(end.dateTime).getTime() - new Date(start.dateTime).getTime()));

      // Create a new event with the same details but future dates
      const createdEvent = await gmailClient.createEvent(
        summary,
        location,
        description,
        newStartDate.toISOString(),
        newEndDate.toISOString(),
        start.timeZone || 'America/Los_Angeles',
        event.recurrence,
        attendees,
        reminders
      );

      console.log(`Created future event: ${createdEvent.summary}`);
    }
  } catch (error) {
    console.error('Error rescheduling past events:', error);
  }
}

// Function to check if the acknowledge checkbox on the row of Task TODO has been checked
async function checkAcknowledgeCheckbox(task) {
  const taskTitle = task.properties.Task?.title?.[0]?.plain_text;
  if (taskTitle && task.properties.Acknowledge && !task.properties.Acknowledge.checkbox) {
    const alertInstance = new Alert("Task Not Acknowledged", `Task "${taskTitle}" has not been acknowledged.`, "Please acknowledge the task.", false);
    await alertInstance.sendEmail();
    await alertInstance.createNotionPage(notionApi.key, notionApi.databaseId);
    await alertInstance.sendSMSMessage();
  }
}

// Function to check if the completed checkbox on the row of Task TODO has been checked
async function checkCompletedCheckbox(task, databaseClient) {
  const taskTitle = task.properties.Task?.title?.[0]?.plain_text;
  if (taskTitle && task.properties.Completed && task.properties.Completed.checkbox) {
    const alertInstance = new Alert("Task Completed", `Task "${taskTitle}" has been completed.`, "No action needed.", true);
    await alertInstance.sendEmail();
    await alertInstance.createNotionPage(notionApi.key, notionApi.databaseId);
    await alertInstance.sendSMSMessage();
    await deleteTaskFromDatabase(task.id, databaseClient);
  }
}

// Function to delete a task from the database
async function deleteTaskFromDatabase(taskId, databaseClient) {
  try {
    await databaseClient.deleteTask(taskId);
    console.log(`Deleted task with ID: ${taskId}`);
  } catch (error) {
    console.error('Error deleting task from database:', error);
  }
}


// Function to check and alert for task acknowledgements and completions
async function checkTasksAndAlerts() {
  const databaseManager = new NotionDatabaseManager();
  try {
    const tasks = await databaseManager.getAllTasks(); // Assumes a function to get all tasks
    for (const task of tasks) {
      await checkAcknowledgeCheckbox(task);
      await checkCompletedCheckbox(task, databaseManager);
    }
  } catch (error) {
    console.error('Error checking tasks and alerts:', error);
  }
}

// Export the functions for external usage
export { reschedulePastEvents, listNotionPages, checkTasksAndAlerts };
