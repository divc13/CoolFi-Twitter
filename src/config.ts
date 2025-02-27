interface RuntimeSettings {
    bitteApiKey: string;
    bitteApiUrl: string;
    twitterUsername: string;
    twitterPassword: string;
    twitterEmail: string;
    twitterApiKey: string;
    twitterApiSecretKey: string;
    twitterAccessToken: string;
    twitterAccessTokenSecret: string;
}

function getRuntimeSettings(): RuntimeSettings {

    const requiredEnvVars = [
        "TWITTER_USERNAME",
        "TWITTER_PASSWORD",
        "TWITTER_EMAIL",
        "TWITTER_API_KEY",
        "TWITTER_API_SECRET_KEY",
        "TWITTER_ACCESS_TOKEN",
        "TWITTER_ACCESS_TOKEN_SECRET",
        "BITTE_API_KEY",
        "BITTE_API_URL",
    ];

    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            console.log(process.env[envVar]);
            throw new Error(`Missing environment variable: ${envVar}`);
        }
    }

    return {
        bitteApiKey: process.env.BITTE_API_KEY || "",
        bitteApiUrl: process.env.BITTE_API_URL || "",
        twitterUsername: process.env.TWITTER_USERNAME || "",
        twitterPassword: process.env.TWITTER_PASSWORD || "",
        twitterEmail: process.env.TWITTER_EMAIL || "",
        twitterApiKey: process.env.TWITTER_API_KEY || "",
        twitterApiSecretKey: process.env.TWITTER_API_SECRET_KEY || "",
        twitterAccessToken: process.env.TWITTER_ACCESS_TOKEN || "",
        twitterAccessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || "",
    };
}

const settings = getRuntimeSettings();

export { settings };
