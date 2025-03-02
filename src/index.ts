import "dotenv/config";
import { handleDM } from './twitter/directMessage';
import { handleMentions } from './twitter/mention';

async function run() {
    while (true) {
        try {
            await handleDM(); 
            // await handleMentions();
        } catch (error) {
            console.error("Error in handleDM or handleMentions:", error);
        }
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
    }
}

run();