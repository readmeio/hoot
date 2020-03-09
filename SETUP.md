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
npm run upload
```

4. Feel free to poke around in the code — when you're ready, click the **Show** button to interact with your very own Hoot platform!

## FAQ
#### My `.env` is populated with a valid API key, but I'm still seeing an error when trying to upload my OpenAPI file. Help!

In certain environments, Bash scripts don't automatically read variables from your `.env` file. To set those variables, run the following command in your console:
```
export $(grep -v '^#' .env | xargs)
```
* **Note**: this only loads the `.env` in to the **current** shell, so you'll have to run this every time you open a new console window!

You can verify that your API key was properly set by running the following:
```
echo $API_KEY
```
Once the `$API_KEY` variable has been properly set, you should be able to run `npm run upload` with no issues!
