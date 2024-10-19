const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages, model } = JSON.parse(event.body);

    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0.7,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.choices[0].message),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred while processing your request.' }),
    };
  }
};
