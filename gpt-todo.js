import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: 'sk-proj-w0Cu7DodOPSJYnpbPVs9T3BlbkFJz1Hmy1roYNOwO4v6taiT'
});

async function getTodoList() {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'write a TODO list for me. \n FORMAT: \n[] item\n [] item\n [] item' }
    ]
  });

  return completion.choices[0].message.content;
}

export default getTodoList;
