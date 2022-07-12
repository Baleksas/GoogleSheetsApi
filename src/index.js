const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
fs.readFile("client-secret.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  // Authorize a client with credentials, then call the Google Sheets API.\

  authorize(JSON.parse(content), functionsChain);

  // authorize(JSON.parse(content), getValues);
  // authorize(JSON.parse(content), getValuesMultipleRanges);
  // authorize(JSON.parse(content), writeValues);
  // authorize(JSON.parse(content), createSheet);
  // authorize(JSON.parse(content), copySheet);
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

// Makes a copy of a specified sheet. Important: destination sheet id must exist before copying into it.
function copySheet(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const request = {
    spreadsheetId: "1Znc2RBemy_rvsBZXv2EwDItin4e76Vp3nM3iWv_QqKw",
    sheetId: 1805430215,
    resource: {
      destinationSpreadsheetId: "1Znc2RBemy_rvsBZXv2EwDItin4e76Vp3nM3iWv_ABCD",
    },
  };

  sheets.spreadsheets.sheets.copyTo(request, (err, res) => {
    console.log(res);
    if (err) {
      console.log("Error: ", err);
    }
  });
}

function createSheet(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const request = {
    resource: {
      properties: {
        title: "TestingSheettttt",
      },
    },
  };

  sheets.spreadsheets.create(request, (err, res) => {
    console.log(res);
    if (err) {
      console.log("Error: ", err);
    }
  });
}

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

// Create sheet
// Get sheet id and spreadsheet id
// Copy from the original copy of the timesheet to a created sheet by providing sheet id and spreadsheetid (give it the dynamic title as well)
// Pick cells or form a 2d array to dynamically change values of the specific cells
// Write into the copy spreadsheet 2d arrays with dynamically written arguments to change specific cells

// QUESTIONS
// How to make functions with arguments. Need to find a way around auth by implementing it inside every function?
// If above question is solved, UI could be made in order to dynamically write values and make requests by buttons

async function functionsChain(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  // Create
  const request = {
    resource: {
      properties: {
        title: "TestingSheettttt",
      },
    },
  };
  try {
    const createRes = await sheets.spreadsheets.create(request);
  } catch (error) {
    console.log(error);
  }
}
