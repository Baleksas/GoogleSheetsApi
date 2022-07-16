const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const { getWeekDay } = require("./utils/dateGetter");
// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
const credentials = fs.readFileSync("client-secret.json");
if (!credentials) console.log("Error loading client secret file");
// Authorize a client with credentials, then call the Google Sheets API.\
const { client_secret, client_id, redirect_uris } =
  JSON.parse(credentials).installed;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);
const tkn = fs.readFileSync(TOKEN_PATH);
// Check if we have previously stored a token.
if (!tkn) {
  getNewToken(oAuth2Client, createSheet);
}
oAuth2Client.setCredentials(JSON.parse(tkn));

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          "Error while trying to retrieve access token",
          err
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

// Create sheet
// Get sheet id and spreadsheet id
// Copy from the original copy of the timesheet to a created sheet by providing sheet id and spreadsheetid (give it the dynamic title as well)
// Pick cells or form a 2d array to dynamically change values of the specific cells
// Write into the copy spreadsheet 2d arrays with dynamically written arguments to change specific cells

// QUESTIONS
// What is sheet id? Should it start from 0 ant iterate up or be generated automatically?

let defaultSSId = "1Znc2RBemy_rvsBZXv2EwDItin4e76Vp3nM3iWv_QqKw";
let defaultSId = 1805430215;
let defaultSheetName = "Copy of Time sheet_test";
// functionsChain({
//   title: "NewestSheet_1",
//   defaultSSId,
//   defaultSId,
//   defaultSheetName,
// });
/**
 * Execute chain of functions to create, copy and write into a sheet to perform required task:
 * Get a copy of default Spreadsheet and insert values into it
 * @param {string} title Title to create a new spreadsheet with.
 * @param {string} defaultSSId Default Spreadsheet Id.
 * @param {number} defaultSId Default Sheet id.
 *
 */
// inserted curly brackets before and after arguments to pass an object, haven't tested. hopefully works.
async function functionsChain(args) {
  const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
  // Create
  const requestForCreate = {
    resource: {
      properties: {
        title: args.title,
      },
    },
  };
  let status = [["First", 1]];
  try {
    // FIXME: When creating a new file, it neeeds to have a sheet. Therefore, Sheet1 is automatically generated. After copying
    // copy sheet into it, it generates another sheet. After that, need to delete the Sheet1 sheet.
    const createRes = await sheets.spreadsheets.create(requestForCreate);
    status.push(["Create status ", createRes.status]);
    status.push(["Create url: ", createRes.config.data.spreadsheetUrl]);
    // createRes.data // sheets array, spreadsheet url provided by json object createRes
    console.log(
      "Created sheet response spreadsheet id: ",
      createRes.data.spreadsheetId
    ); // returns string of spreadsheet id
    // createRes.data.properties; // Title, default format, spreadsheet theme
    console.log("Created sheet title: ", createRes.data.properties.title); // Title, default format, spreadsheet theme
    let createdTitle = createRes.data.properties.title;
    console.log("created title: ", createdTitle);
    // Copy
    const requestForCopy = {
      spreadsheetId: args.defaultSSId,
      sheetId: args.defaultSId,
      resource: {
        destinationSpreadsheetId: `${createRes.data.spreadsheetId}`,
      },
    };
    const copyRes = await sheets.spreadsheets.sheets.copyTo(requestForCopy);
    status.push(["Copy status ", copyRes.status]);

    // console.log("copy res: ", copyRes);
    // copyRes.data // sheets array, spreadsheet url provided by json object copyRes
    console.log(
      "copied sheet response destinationSpreadsheetId : ",
      copyRes.config.data.destinationSpreadsheetId
    ); // returns string of spreadsheet id
    // copyRes.data.properties; // Title, default format, spreadsheet theme
    console.log("Copied sheet id", copyRes.data.sheetId);
    // TODO: Change copied title as it includes "Copy of ...". Change by removing "Copy of" to have original title
    console.log("Copied sheet title", copyRes.data.title); // Title, default format, spreadsheet theme
    // Write dates

    let valuesOfDates = [
      [getWeekDay(1)],
      [getWeekDay(2)],
      [getWeekDay(3)],
      [getWeekDay(4)],
      [getWeekDay(5)],
      [getWeekDay(6)],
      [getWeekDay(7)],
    ];

    const resourceForWrite = {
      values: valuesOfDates,
    };

    const paramsForWrite = {
      spreadsheetId: `${createRes.data.spreadsheetId}`,
      //TODO: make Copy of Time sheet_test dynamic according to given sheet title and renaming it somehow
      range: `Copy of Time sheet_test!C10:C17`,
      valueInputOption: "RAW",
      resource: resourceForWrite,
    };

    const writeRes = await sheets.spreadsheets.values.update(paramsForWrite);
    status.push(["Write status ", writeRes.status]);

    console.log(
      "write sheet response spreadsheet id: ",
      writeRes.data.spreadsheetId
    ); // returns string of spreadsheet id
    console.log("write response spreadsheetid", writeRes.data.spreadsheetId);
  } catch (error) {
    console.log(error);
  }

  return status;
  // return [createRes.status, copyRes.status, writeRes.status];
}

module.exports = { oAuth2Client, functionsChain };
