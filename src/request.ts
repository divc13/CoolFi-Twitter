import { settings } from "./config";

const BITTE_API_KEY = settings.bitteApiKey;
const BITTE_API_URL = settings.bitteApiUrl;

export async function sendChatMessage(message: string) {
  const requestBody = {
    id: generateUniqueId(),
    messages: [
      {
        id: generateUniqueId(),
        createdAt: new Date().toISOString(),
        role: "user",
        content: message,
      },
    ],
    config: {
      mode: "debug",
      agentId: "coolfi-ai.vercel.app",
    },
    accountId: "dc1312.near",
  };

  try {
    const response = await fetch(`${BITTE_API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BITTE_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    return await response.json(); // Return the response from the API
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
}

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 16);
}
