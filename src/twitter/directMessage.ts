import { login } from "./login";
import { settings } from "../config";
import { getUser, upsertUser } from "../db";
import { sendChatMessage } from "../request";


export async function handleDM()
{
    const scrapper = await login();
    const current_time= new Date();

    const dm_responses = await scrapper.getDirectMessageConversations(settings.twitterUsername);

    for (var conversation of dm_responses.conversations)
    {
        const conversationId = conversation.conversationId;

        // get the account ID of the user
        var accountID = conversation.participants[0].id;
        if (accountID == settings.twitterUsername)
        {
            accountID = conversation.participants[1].id;
        }

        // time at which the agent last checked the users messages
        var lastSeenTime = null;
        var walletId = null;
        var userInfo = await getUser(accountID);
        var complete_text = "";

        if (userInfo != null && userInfo.lastSeenTime && userInfo.lastSeenTime != null)
        {
            lastSeenTime = userInfo.lastSeenTime;
        } 

        console.log("LastseenTime ", lastSeenTime)

        if (userInfo != null && userInfo.walletId && userInfo.walletId != null)
        {
            walletId = userInfo.walletId;
        } 

        // merge all the unseen messages into a single string
        for (var message of conversation.messages)
        {
            if (message.senderScreenName == settings.twitterUsername)
                continue;

            const message_time = new Date(Number(message.createdAt));
            if (!lastSeenTime || message_time > lastSeenTime)
            {
                complete_text += message.text + "\n";
            }
        }

        console.log("Complete Text:", complete_text);

        // set the last seen time to the current time
        await upsertUser(accountID, { lastSeenTime: current_time });
        
        // send the user message to bitte ai, and get the response
        const message_to_send = walletId ? await sendChatMessage(conversationId, complete_text, walletId) : await sendChatMessage(conversationId, complete_text);
        
        await scrapper.sendDirectMessage(conversationId, message_to_send);

    }
}
