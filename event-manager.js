import GmailClient from './g-client.js';

async function testCreateEvent() {
  const gmailClient = new GmailClient();
  await gmailClient.initialize();

  try {
    // Create a single event without recurrence
    const createdEvent = await gmailClient.createEvent(
      'Google I/O 2024',
      '800 Howard St., San Francisco, CA 94103',
      'A chance to hear more about Google\'s developer products.',
      '2024-06-15T09:00:00-07:00',
      '2024-06-15T17:00:00-07:00',
      'America/Los_Angeles',
      null, // No recurrence
      [
        { email: 'lpage@example.com' },
        { email: 'sbrin@example.com' }
      ],
      {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 10 }
        ]
      }
    );

    console.log('Event created successfully:', createdEvent);

    // Wait 10 seconds before deleting the event
    setTimeout(async () => {
      try {
        await gmailClient.deleteEvent(createdEvent.id);
        console.log('Event deleted successfully');
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }, 10000); // 10000 milliseconds = 10 seconds

  } catch (error) {
    console.error('Error creating event:', error);
  }
}

// Call the function to test creating and then deleting an event
testCreateEvent();

// TODO: find all events before the current day
async function findPastEvents() {
  const gmailClient = new GmailClient();
  await gmailClient.initialize();

  try {
    const events = await gmailClient.listPastEvents();
    const now = new Date();
    console.log('Current date and time:', now);

    const pastEvents = events.filter(event => {
      const end = new Date(event.end.dateTime || event.end.date);
      console.log(`Event end date and time: ${end}, Event summary: ${event.summary}`);
      return end < now;
    });

    console.log('Past events this month:', pastEvents);
    return pastEvents;
  } catch (error) {
    console.error('Error finding past events:', error);
  }
}

// Call the function to find all events before the current day
async function main() {
  console.log("Finding expired events....");
  await findPastEvents();
  console.log("Done.");
}

main();
