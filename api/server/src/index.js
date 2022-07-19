const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";
//Import utils
const { getRequests } = require("./utils/requests");
const { getDataToWrite } = require("./utils/getDataToWrite");

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
 * Get and store new token after prompting for user authorization
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
    });
  });
}

// Create sheet
// Get sheet id and spreadsheet id
// Copy from the original copy of the timesheet to a created sheet by providing sheet id and spreadsheetid (give it the dynamic title as well)
// Pick cells or form a 2d array to dynamically change values of the specific cells
// Write into the copy spreadsheet 2d arrays with dynamically written arguments to change specific cells

/**
 * Execute chain of functions to create, copy and write into a sheet to perform required task:
 * Get a copy of default Spreadsheet's sheet and write values into it
 * @param {args} args - Arguments object {
    title,
    defaultSSId,
    defaultSId,
    sheet_name,
    startingDate,
    employee
  }
 *
 */
async function functionsChain(args) {
  const sheets = google.sheets({ version: "v4", auth: oAuth2Client });

  //Initialize status array to store status codes of all responses
  let status = [];
  //Initialize spreadsheetUrl to be able to edit it in try
  let spreadsheetUrl;

  try {
    // Create
    const requestForCreate = getRequests("CREATE", args);

    const createRes = await sheets.spreadsheets.create(requestForCreate);
    // Get spreadsheeturl which will later be exported
    spreadsheetUrl = createRes.data.spreadsheetUrl;
    status.push(createRes.status);

    // Copy
    const requestForCopy = getRequests("COPY", args, createRes);

    const copyRes = await sheets.spreadsheets.sheets.copyTo(requestForCopy);
    status.push(copyRes.status);

    // Write
    const dataForWriting = getDataToWrite(args, copyRes.data.title);

    const resourceForWrite = {
      data: dataForWriting,
      valueInputOption: "RAW",
    };

    const writeRes = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: `${createRes.data.spreadsheetId}`,
      resource: resourceForWrite,
    });
    status.push(writeRes.status);

    // First created sheet is auto generated when spreadsheet was created
    const createdSheet = createRes.data.sheets[0];

    // Delete generetaed Sheet
    const batchUpdateRequest = getRequests("DELETE", null, createdSheet);

    const deleteRes = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: createRes.data.spreadsheetId,
      resource: batchUpdateRequest,
    });
    status.push(deleteRes.status);

    const renameRequest = getRequests("RENAME", args, copyRes);
    const renameRes = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: createRes.data.spreadsheetId,
      resource: renameRequest,
    });
    status.push(renameRes.status);
  } catch (error) {
    console.log(error);
    status.push(error.response.status);
  }
  return { spreadsheetUrl, status };
}

module.exports = { oAuth2Client, functionsChain };
