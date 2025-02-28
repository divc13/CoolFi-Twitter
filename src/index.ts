import { sendChatMessage } from './request';
import { settings } from './config';
import "dotenv/config";
import { handleDM } from './twitter/directMessage';

async function run() {
    while (true) {
        try {
            await handleDM(); // Run the function
        } catch (error) {
            console.error("Error in handleDM:", error);
        }
        await new Promise(resolve => setTimeout(resolve, 15000)); // Wait for 15 seconds
    }
}

run();