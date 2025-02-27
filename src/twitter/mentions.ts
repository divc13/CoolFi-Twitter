// import { SearchMode } from "agent-twitter-client";
// import { login } from "./login";
// import { settings } from "../config";
// import { getUser, upsertUser } from "../db";
// import { sendChatMessage } from "../request";

// var previousDate:any = null;
// const MAX_TWEETS=100;

// export async function handleMentions()
// {
//     const scrapper = await login();
//     const current_time= new Date();

//     const since = previousDate?.toISOString().split("T")[0];
//     const query = since ? `@${settings.twitterUsername} since:${since}` : `@${settings.twitterUsername}`;

//     const tweetStream = scrapper.searchTweets(query, MAX_TWEETS, SearchMode.Latest);
//     for await (const tweet of tweetStream) {
//         const message = tweet.text;

//     }
//     previousDate = current_time;


// }