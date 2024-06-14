import GmailClient from './g-client.js';

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

// Call the function to reschedule past events
reschedulePastEvents();
