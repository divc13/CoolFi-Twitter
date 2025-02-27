import { Scraper } from "agent-twitter-client";
import { Cookie } from 'tough-cookie';
import { settings } from "../config";

let sessionCookies:Cookie[]; 

export async function login() : Promise<Scraper>
{
    const scraper:Scraper = new Scraper();
    if (sessionCookies) {
        console.log("✅ Using cached session cookies...");
        await scraper.setCookies(sessionCookies);
    } else {
        console.log("🔄 Logging in...");
        await scraper.login(
            settings.twitterUsername,
            settings.twitterPassword,
            settings.twitterEmail,
            settings.bitteApiKey,
            settings.twitterApiSecretKey,
            settings.twitterAccessToken,
            settings.twitterAccessTokenSecret
        );

        sessionCookies = await scraper.getCookies();
        console.log("Session cookies saved in memory.");
    }

    return scraper;
}