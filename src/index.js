const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
fs.readFile("client-secret.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  // Authorize a client with credentials, then call the Google Sheets API.\

  authorize(JSON.parse(content), getValues);
  authorize(JSON.parse(content), getValuesMultipleRanges);
  authorize(JSON.parse(content), writeValues);
  // authorize(JSON.parse(content), create);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

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

// Functions for spreadsheet

// Params for specifying spreadsheet id and range to read/write/update
const params = {
  spreadsheetId: "1Znc2RBemy_rvsBZXv2EwDItin4e76Vp3nM3iWv_QqKw",
  range: "B10:H",
};
const paramsRanges = {
  spreadsheetId: "1Znc2RBemy_rvsBZXv2EwDItin4e76Vp3nM3iWv_QqKw",
  ranges: ["B10:H", "B3:H"],
};

let values = [
  ["Cell 1", "Cell 1"],
  ["Cell 1", "Cell 1"],
];
const resource = {
  values,
};

const paramsWrite = {
  spreadsheetId: "1XMLHUShvigNotTHea-DdjVh7usu9cSnTK9yt21fa5jI",
  range: "Sheet1!A1:B2",
  valueInputOption: "RAW",
  resource,
};
const paramsCreate = {
  title: `SpreadSheet${Math.random(0, 100)}`,
};

// /**
//  * Create a google spreadsheet
//  * @param {string} title Spreadsheets title
//  * @return {string} Created spreadsheets ID
//  */
// async function create(auth) {
//   const sheets = google.sheets({ version: "v4", auth });
//   const resource = {
//     properties: {
//       title: paramsCreate.title,
//     },
//   };
//   sheets.spreadsheets.create(
//     {
//       resource,
//       fields: "spreadsheetIdSample",
//     },
//     (err, res) => {
//       console.log(res);
//       if (err) console.log("Error: ", err);
//     }
//   );
// }

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function getValues(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  sheets.spreadsheets.values.get(params, (err, res) => {
    if (err) return console.log("The API returned an error: " + err);

    const rows = res.data.values;
    console.log("rows: ", rows);
    if (rows.length) {
      //Print cpecified columns or the entire row
      rows.map((row) => {
        // console.log(row); // Row
        // console.log(row[0]); //Column 1
      });
    } else {
      console.log("No data found.");
    }
  });
}

function getValuesMultipleRanges(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  sheets.spreadsheets.values.batchGet(paramsRanges, (err, res) => {
    // console.log(`${res.data.valueRanges.length} ranges retrieved.`);
    res.data.valueRanges.map((range) => {
      // console.log(range);
    });
  });
}
function writeValues(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  sheets.spreadsheets.values.update(paramsWrite, (err, res) => {
    if (err) console.log("ERROR: ", err);
    console.log(paramsWrite);
    console.log(res);
    console.log("res: ", res);
  });
}
