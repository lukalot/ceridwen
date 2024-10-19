export default async (Request) => {
  const text = await Request.text();
  const { messages, model } = JSON.parse(text);

  const API_URL = "https://api.openai.com/v1/chat/completions";
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

  const bodyParams = {
    model: model || "gpt-3.5-turbo",
    messages: messages,
    max_tokens: 512,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(bodyParams)
  };

  try {
    const res = await fetch(API_URL, requestOptions);
  
    if (!res.ok) {
      const errorMessage = await res.text();
      console.error(`OpenAI API Error: ${res.status} ${res.statusText} - ${errorMessage}`);
      throw new Error(`OpenAI API Error: ${res.status} ${res.statusText}`);
    }
  
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      },
    });
  } catch (error) {
    console.error('Error while processing request:', error);
    return new Response(error.message || 'Internal server error', { status: 500 });
  }  
};
