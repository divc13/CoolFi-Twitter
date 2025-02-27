import { sendChatMessage } from './request';
import { settings } from './config';
import "dotenv/config";

(async () => {
  await sendChatMessage("Hello, world!");
})();
