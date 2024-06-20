Notion Receptionist
Notion Receptionist is an all-in-one productivity, time management, and organization tool. It integrates various functionalities, including generating TODO lists, sending alerts via email and SMS, managing Google Calendar events, and interacting with Notion pages and databases.

Features
TODO List Generation: Automatically generate TODO lists based on your Google Calendar events.

Alert System: Send alerts via email and SMS, and log them in Notion.

Event Management: Reschedule past events and list all Notion pages.

Notion Integration: Create and manage Notion pages and databases.

Prerequisites
Node.js: Ensure you have Node.js installed on your machine.
Environment Variables: Create a .env file in the root directory with the following content:

Copy code

NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id
GMAIL_USER=your_gmail_user
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
SMS_SENDER=whatsapp:+your_sender_number
SMS_RECIPIENT=whatsapp:+your_recipient_number


Installation

Clone the Repository:

bash
Copy code
git clone https://github.com/Sbussiso/notion-receptionist.git
cd notion-receptionist

Install Dependencies


bash
Copy code
npm install
Usage
Run the Application:
bash
Copy code
node index.js
Environment Configuration
Ensure your .env file is properly configured with the necessary API keys and credentials.

env
Copy code
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id
GMAIL_USER=your_gmail_user
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
SMS_SENDER=whatsapp:+your_sender_number
SMS_RECIPIENT=whatsapp:+your_recipient_number


Modules

index.js
The main entry point of the application. It initializes the Notion database, fetches page data, generates TODO lists, creates alerts, reschedules past events, and lists all Notion pages.

gpt-todo.js
Generates TODO lists based on Google Calendar events and creates a Notion page with the TODO items.

g-client.js
Manages interactions with Google APIs for Gmail and Calendar functionalities.

event-manager.js
Manages rescheduling of past events and listing Notion pages.

db-manager.js
Manages the Notion database, ensuring it exists and creating it if necessary.

alert.js
Handles creating alerts, sending emails, and sending SMS messages.

pages.js
Contains functions to retrieve data and blocks from a Notion page.

sendSMS.js
Sends SMS messages using Twilio.


License
This project is licensed under the MIT License.

Contributions
Contributions are welcome! Please read the contributing guidelines before submitting a pull request.

Contact
For any questions or issues, please open an issue on GitHub.