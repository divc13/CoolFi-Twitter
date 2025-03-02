import { login } from "./login";
import { settings } from "../config";
import { sendChatMessage } from "../request";
import { SearchMode } from "agent-twitter-client";

var previous_time: any = null;
const MAX_TWEETS=100;

export async function handleMentions()
{
    const scrapper = await login();
    const current_time= new Date();
    
    const query = previous_time? `@${settings.twitterUsername}`: `@${settings.twitterUsername}`;
    console.log(query);

    const tweetStream = scrapper.searchTweets(query, MAX_TWEETS, SearchMode.Users);
    for await (const tweet of tweetStream) 
    {
        const tweet_text = tweet.text;
        const tweetId = tweet.id;
        const accountID = tweet.userId;
        const conversationId = tweet.userId + "-" + scrapper.getUserIdByScreenName(settings.twitterUsername);

        console.log(tweet_text);

        var present = false;
        const mentions = tweet.mentions;
        for (var mention of mentions)
        {
            if (mention.username == settings.twitterUsername) present = true;
        }
        if (!present) continue;

        if (accountID && tweetId && tweet_text)
        {
            const message_to_send =  await sendChatMessage(accountID, conversationId, tweet_text);
            await scrapper.sendTweet(message_to_send, tweetId);
        }
    }

    previous_time = current_time;
}
