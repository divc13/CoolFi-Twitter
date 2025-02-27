import { sendChatMessage } from './request';
import { settings } from './config';
import "dotenv/config";
import { handleDM } from './twitter/directMessage';

(async () => {
//   await sendChatMessage("1234567890", "Do you know my account id?");
    await handleDM();

})();
