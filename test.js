import dotenv from 'dotenv';
import TodoGenerator from './gpt-todo.js'; // Import TodoGenerator

// Load environment variables from .env file
dotenv.config();

async function testGetEmailSnapshot() {
  const todoGenerator = new TodoGenerator();
  const emailSnapshot = await todoGenerator.getEmailSnapshot();
  console.log(emailSnapshot);
}

testGetEmailSnapshot();
