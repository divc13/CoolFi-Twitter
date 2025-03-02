import { login } from "./login";
import { settings } from "../config";
import { sendChatMessage } from "../request";

var previousTime:any = null;

export async function handleDM()
{
    const scrapper = await login();
    const current_time= new Date();
    
    const dm_responses = await scrapper.getDirectMessageConversations(settings.twitterUsername);
    
    for (var conversation of dm_responses.conversations)
    {
        const conversationId = conversation.conversationId;
        console.log("Conversation ID:", conversationId);

        // get the account ID of the user
        var accountID = conversation.participants[0].id;
        if (accountID == settings.twitterUsername)
        {
            accountID = conversation.participants[1].id;
        }

        var complete_text = "";

        // merge all the unseen messages into a single string
        for (var message of conversation.messages)
        {
            if (message.senderScreenName == settings.twitterUsername)
                continue;

            const message_time = new Date(Number(message.createdAt));
            if (!previousTime || message_time > previousTime)
            {
                complete_text += message.text + "\n";
            }
        }

        console.log("Complete Text:", complete_text);
        if (complete_text.length > 0)
        {
            const message_to_send = await sendChatMessage(accountID, conversationId, complete_text);
            await scrapper.sendDirectMessage(conversationId, message_to_send);
        }
    }

    previousTime = current_time;
}
