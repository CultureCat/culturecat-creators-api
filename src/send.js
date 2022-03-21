const fetch = require("node-fetch");
const fs = require('fs');
const FormData = require('form-data');

const args = process.argv.slice(2);
const action = args[0];
const jsonPath = args[1];
const imgFolderPath = args[2];
const apiKey = args[3];

if (!action || !jsonPath || !imgFolderPath || !apiKey)
  throw new Error(`Arguments: "{action} {events JSON path} {image folder path} {apikey}" ex. "validate ./samples/events-good.json ./samples/images YOUR_APIKEY_HERE"`)

if (!`validate,upsert,replace`.split(`,`).find((s) => s === action)) {
  console.log(`First argument must be validate,upsert,replace`);
}
if (!fs.existsSync(jsonPath)) {
  console.log(`Second argument must be a path to a JSON file, containing an array of event objects`);
}
if (!fs.existsSync(imgFolderPath)) {
  console.log(`Third argument must be a path to a folder, containing images named {event id}.jpg`);
}
let raw = fs.readFileSync(jsonPath);
let events = JSON.parse(raw);

const endpointBase = `https://culturecat-services.azurewebsites.net/api/feed`;
const result = fetch(`${endpointBase}/${action}`, {
  method: 'POST',
  body: JSON.stringify(events),
  headers: {
    'Content-Type': 'application/json',
    'api-key': apiKey,
  }
}).then(response => response.json()).then((result) => {
  if (result.problems) {
    console.error(result.problems.join(`\n`));
  } else {
    // Events JSON was uploaded, now upload images...
    events.forEach((event) => {
      const imgPath = `${imgFolderPath}/${event.id}.jpg`;
      if (fs.existsSync(imgPath)) {
        console.log(`Sending ${imgPath}`);
        const formData = new FormData();
        formData.append(`file`, fs.readFileSync(imgPath), {
          filename: 'eventimage.jpg',
          contentType: 'image/jpeg'
        });
        const imgUpload = fetch(`${endpointBase}/image?eventid=${encodeURIComponent(event.id)}`, {
          method: 'POST',
          body: formData,
          headers: {
            'api-key': apiKey,
          }
        }).then(response => response.json()).then((result) => {
          console.log(event.id, result);
        });
      } else console.log(`Did NOT upload any image for event with id ${event.id}, ${event.id}.jpg not found in image folder.`);
    });
    console.log(`EVENT JSON OK: ${result.details}`);
  }
});
