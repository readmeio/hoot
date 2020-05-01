# Setup

To get started, all you need to do is:

1. Create a new project (see **ReadMe Project Data Disclaimer** below) on [ReadMe](https://readme.com) and populate your [ReadMe API Key](https://docs.readme.com/developers/docs/authentication) in your `.env` with the following format:

```
API_KEY=<Your ReadMe API Key Here>
```

- **Note**: make sure there are no spaces around the equal sign or after your API key!

2. In your terminal, run the following command (and answer the subsequent prompts) to generate your OpenAPI definition and upload it to your ReadMe project:

```
npm run upload
```

3. Feel free to poke around in the code — when you're ready, click the **Show** button to interact with your very own Hoot platform!

## ReadMe Project Data Disclaimer

Be sure to create a **new** project on ReadMe — we **do not** recommend connecting Hoot to an exising ReadMe project that is already connected to a production API!

The Custom Login and API Metrics examples in this code are **simplified and for demonstrative purposes**.

## FAQ

#### Where can I access my terminal if I'm using Glitch?

Click the **Tools** button in the lower-lefthand corner and select **Terminal** (see image below). If you can't see the **Tools** button, you'll need to [remix the project](https://glitch.com/edit/#!/remix/hoot) first!

<img width="200" alt="Glitch Terminal Screenshot" src="https://user-images.githubusercontent.com/8854718/80822049-7eb3e080-8b9f-11ea-8512-2d4be9d5a6c1.png">

#### My `.env` is populated with a valid API key, but I'm still seeing an error when trying to upload my OpenAPI file. Help!

In certain environments, Bash scripts don't automatically read variables from your `.env` file. To set those variables, run the following command in your console:

```
export $(grep -v '^#' .env | xargs)
```

- **Note**: this only loads the `.env` in to the **current** shell, so you'll have to run this every time you open a new console window!

You can verify that your API key was properly set by running the following:

```
echo $API_KEY
```

Once the `$API_KEY` variable has been properly set, you should be able to run `npm run upload` with no issues!
