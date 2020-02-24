# Setup

To get started, all you need to do is:

<!-- (Maybe we shouldn't use .env.sample and use regular old .env instead? TODO: Test if it properly copies the keys when remixing!) -->

1. Rename the `.env.sample` file to `.env`
1. Create a project on [ReadMe](https://readme.com) and populate your [ReadMe API Key](https://docs.readme.com/developers/docs/authentication) in your `.env` with the following format:

```
API_KEY=<Your ReadMe API Key Here>
```
* **Note**: make sure there are no spaces around the equal sign or after your API key!

3. In the console, run the following command to generate your OpenAPI definition and upload it to your ReadMe project:

```
npm run upload-openapi
```

4. Once you've uploaded your OpenAPI definition to ReadMe, be sure to save the `_id` that's returned to your `.env` so you can re-sync your specification to ReadMe (instead of creating a new one). Use the following format when adding it to your `.env`:

```
API_SPEC_ID=<Your API Spec ID Here>
```

5. Feel free to poke around in the code — when you're ready, click the **Show** button to interact with your very own Hoot platform!
