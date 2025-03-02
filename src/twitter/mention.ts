import { login } from "./login";
import { settings } from "../config";
import { sendChatMessage } from "../request";
import { SearchMode } from "agent-twitter-client";

var previous_time: Date = new Date();
const MAX_TWEETS=50;
const repliedSet = new Set<string>();

export async function handleMentions()
{
    const scrapper = await login();
    const current_time= new Date();

    const query = `(@${settings.twitterUsername}) (to:${settings.twitterUsername})`;
    console.log(query);

    const tweetStream = scrapper.searchTweets(query, MAX_TWEETS, SearchMode.Latest);
    for await (const tweet of tweetStream) 
    {
        const tweet_text = tweet.text;
        const tweetId = tweet.id;
        const accountID = tweet.userId;
        const my_acc_id = await scrapper.getUserIdByScreenName(settings.twitterUsername);
        
        if (!tweetId || !tweet_text || !accountID || repliedSet.has(tweetId) || !tweet.userId) continue;

        const conversationId = tweet.userId > my_acc_id? `${my_acc_id}-${tweet.userId}` : `${tweet.userId}-${my_acc_id}`;
        
        console.log(tweet_text);
        for (var tx of tweet.thread)
        {
            console.log(tx.text);
        }

        var present = false;
        const mentions = tweet.mentions;
        for (var mention of mentions)
        {
            if (mention.username == settings.twitterUsername) present = true;
        }
        if (!present) continue;

        const message_to_send =  await sendChatMessage(accountID, conversationId, tweet_text);
        await scrapper.sendTweet(message_to_send, tweetId);
        repliedSet.add(tweetId);
    }

    previous_time = current_time;
}
