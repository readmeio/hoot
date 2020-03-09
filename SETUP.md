# Setup

To get started, all you need to do is:

<!-- (Maybe we shouldn't use .env.sample and use regular old .env instead? TODO: Test if it properly copies the keys when remixing!) -->

1. Rename the `.env.sample` file to `.env`
1. Create a project on [ReadMe](https://readme.com) and populate your [ReadMe API Key](https://docs.readme.com/developers/docs/authentication) in your `.env` with the following format:

```
API_KEY=<Your ReadMe API Key Here>
```
* **Note**: make sure there are no spaces around the equal sign or after your API key!

3. In the console, run the following command (and answer the subsequent prompts) to generate your OpenAPI definition and upload it to your ReadMe project:

```
npm run upload-openapi
```

4. Feel free to poke around in the code — when you're ready, click the **Show** button to interact with your very own Hoot platform!
