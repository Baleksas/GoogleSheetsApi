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
      sheets: [
        {
          properties: {
            title: args.sheet_name,
          },
        },
      ],

      properties: {
        title: args.title,
      },
    },
  };
  let status = [];
  // FIXME: When creating a new file, it neeeds to have a sheet. Therefore, Sheet1 is automatically generated. After copying
  // copy sheet into it, it generates another sheet. After that, need to delete the Sheet1 sheet.
  const createRes = await sheets.spreadsheets.create(requestForCreate);
  if (createRes.status !== 200) return createRes;
  const spreadsheetUrl = createRes.data.spreadsheetUrl;
  status.push(createRes.status);

  // Copy
  const requestForCopy = {
    spreadsheetId: args.defaultSSId,
    sheetId: args.defaultSId,
    resource: {
      destinationSpreadsheetId: `${createRes.data.spreadsheetId}`,
    },
  };
  const copyRes = await sheets.spreadsheets.sheets.copyTo(requestForCopy);
  if (copyRes.status !== 200) return copyRes;
  status.push(copyRes.status);

  // Write dates
  // TODO: Fix dates formatting to avoid redundancy
  var { formatDate } = require("./utils/formatDate");
  let sdate = new Date(args.startingDate);
  let week = [];
  for (var i = 0; i < 7; i++) {
    sdate.setDate(sdate.getDate() + 1);
    week.push([formatDate(sdate.toLocaleDateString("en-US"))]);
  }
  let valuesOfDates = week;
  const writeData = [
    {
      range: `${copyRes.data.title}!C10:C17`,
      values: valuesOfDates,
    },
    {
      range: `${copyRes.data.title}!H3:H3`,
      values: [valuesOfDates[0]],
    },
    {
      range: `${copyRes.data.title}!H4:H4`,
      values: [valuesOfDates[6]],
    },
  ];

  const resourceForWrite = {
    data: writeData,
    valueInputOption: "RAW",
  };

  try {
    const writeRes = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: `${createRes.data.spreadsheetId}`,
      resource: resourceForWrite,
    });
    status.push(writeRes.status);
  } catch (error) {
    console.log(error);
    status.push(error.response.status);
  }

  // First created sheet is auto generated when spreadsheet was created
  const createdSheet = createRes.data.sheets[0];

  // Delete generetaed Sheet
  const batchUpdateRequest = {
    requests: [
      {
        deleteSheet: {
          sheetId: createdSheet.properties.sheetId,
        },
      },
    ],
  };
  const deleteRes = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: createRes.data.spreadsheetId,
    resource: batchUpdateRequest,
  });

  status.push(deleteRes.status);

  const renameRequest = {
    requests: [
      {
        updateSheetProperties: {
          properties: {
            sheetId: copyRes.data.sheetId,
            title: args.sheet_name ? args.sheet_name : "Default",
          },
          fields: "title",
        },
      },
    ],
  };
  const renameRes = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: createRes.data.spreadsheetId,
    resource: renameRequest,
  });
  status.push(renameRes.status);
  return { spreadsheetUrl, status };
}

module.exports = { oAuth2Client, functionsChain };
