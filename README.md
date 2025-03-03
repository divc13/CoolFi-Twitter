# CoolFi: What's cooler than being Cool?

This repository is for running the twitter server. This can be run independently of the original CoolFi server.

Quick Start

1. Clone this repository
2. Configure environment variables (create a `.env` or `.env.local` file)

```
TWITTER_USERNAME=
TWITTER_PASSWORD=
TWITTER_EMAIL=
TWITTER_API_KEY=
TWITTER_API_SECRET_KEY=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_TOKEN_SECRET=
BITTE_API_KEY=
BITTE_API_URL="https://wallet.bitte.ai/api/v1"
```

3. Install dependencies:

```bash
pnpm install
```

4. Start the development server:

```bash
pnpm run dev
```

API Endpoints are available at /.well-known/ai-plugin.json

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
