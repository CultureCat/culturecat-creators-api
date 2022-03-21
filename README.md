# Culture Cat API client
Client project for Culture Cat's API for uploading events using REST.

Please visit https://www.culturecat.dk/creators/api for Culture Cat API documentation.
If you do not have a login, get one at https://www.culturecat.dk/addevent

When you "upsert" or "replace" data you can see the result immediately using your login on https://www.culturecat.dk/creators while it may take up to an hour, before it is shown on https://www.culturecat.dk (publicly).

## Setup
1. Clone or download this project
2. Run `npm install`
3. Obtain your test and live API Keys from https://www.culturecat.dk/creators/api

## Test with sample data
Once the project has been set up and you have your API keys, use the test key to test:

```
  npm run validate ./samples/events.json ./samples/images/ TEST_APIKEY 
``` 

## Test with your own data
When you have packaged your events in one JSON file and have event images in a folder (each image named {event-id}.jpg) you can test is using this command:

```
  npm run validate JSON_PATH JPG_FOLDER_PATH TEST_APIKEY 
``` 

The command should respond with `EVENT JSON OK: validate completed` if everything is okay. Otherwise check the response message.

## Update with your own data
When you have verified your data, use the live API Key and update using the following command:

```
  npm run replace JSON_PATH JPG_FOLDER_PATH LIVE_APIKEY 
``` 


