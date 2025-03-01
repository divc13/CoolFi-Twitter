import { settings } from "./config";

const BITTE_API_KEY = settings.bitteApiKey;
const BITTE_API_URL = settings.bitteApiUrl;

async function readStream(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  let result = "";
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }

  return result;
}

function formatResponse(apiResponses:any) {
    const formatted:any = { messages: [] };
  
    for (let i = 0; i < apiResponses.length; i++) {
      const response = apiResponses[i];

      if (response.role == "user") {
        formatted.messages.push( {
          id: response.id || generateUniqueId(),
          role: response.role,
          content: response.content,
        });
      }

      if (response.role === "assistant") {
        const toolCall = response.content.find(c => c.type === "tool-call");
        if (toolCall) {
          const nextResponse = apiResponses[i + 1];
          if (nextResponse && nextResponse.role === "tool") {
            const toolResult = nextResponse.content.find(c => c.type === "tool-result" && c.toolCallId === toolCall.toolCallId);
            formatted.messages.push({
              id: response.id,
              role: "assistant",
              content: "",
              toolInvocations: [
                {
                  state: "result",
                  toolCallId: toolCall.toolCallId,
                  toolName: toolCall.toolName,
                  args: toolCall.args,
                  result: toolResult ? toolResult.result : null,
                },
              ],
            });
          }
        }
        else {
          formatted.messages.push({
            id: response.id,
            role: response.role,
            content: response.content[0]?.text,
          });
        }
      }
    }
  
    return formatted.messages;
  }
  
export async function sendChatMessage(accountId:string, conversationId: string, message: string, wallet_id?: string) {
  
  message = message + `\nThis is a message from twitter. The conversation id is ${conversationId}\n`;
  const id = Buffer.from(accountId).toString("base64");
  console.log("ID:", id); 
  
  const url = `${BITTE_API_URL}/history?id=${id}`;

  const history_response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${BITTE_API_KEY}`,
    },
  });

  var result = [];
  if (history_response.status == 200) {
    const res = await history_response.json();
    result = formatResponse(res.messages);
  }

  result.push({
    id: generateUniqueId(),
    role: "user",
    content: message,
  });

  console.log({result});

  const response = await fetch(`${BITTE_API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BITTE_API_KEY}`,
    },
    body: JSON.stringify({
      id: id,
      messages: result,
      config: {
        mode: "debug",
        agentId: "coolfi-ai.vercel.app",
      },
      accountId: wallet_id,
    }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status: ${response.status}`);
  }

  const responseBody = await readStream(response.body as ReadableStream);
  const cleanedMessage = responseBody
      .split("\n")                 // Split into lines
      .filter(line => line.startsWith('0:')) // Keep only message chunks
      .map(line => line.replace(/^0:"/, "").replace(/"$/, "")) // Remove prefix/suffix
      .join("");                   // Join back into a single string


  console.log("Cleaned Message:", cleanedMessage);
  return cleanedMessage;
}


function generateUniqueId() {
  return Math.random().toString(36).substr(2, 16);
}
