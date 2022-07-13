import { oAuth2Client } from "./index";
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
function copySheet() {
  const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
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

function createSheet(title) {
  const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
  const request = {
    resource: {
      properties: {
        title: title,
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

function getValues() {
  const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
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

function getValuesMultipleRanges() {
  const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
  sheets.spreadsheets.values.batchGet(paramsRanges, (err, res) => {
    // console.log(`${res.data.valueRanges.length} ranges retrieved.`);
    res.data.valueRanges.map((range) => {
      // console.log(range);
    });
  });
}

function writeValues() {
  const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
  sheets.spreadsheets.values.update(paramsWrite, (err, res) => {
    if (err) console.log("ERROR: ", err);
    console.log(paramsWrite);
    console.log(res);
    console.log("res: ", res);
  });
}
