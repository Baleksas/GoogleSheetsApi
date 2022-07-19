/**
 * Get a request according to the action
 * @param {string} action - action for which to return request: "CREATE" | "COPY"
 * @param {object} args - Arguments object
 * @param {object} extra - Additional data if required (usually a response of one of the previous responses)
 *
 */
function getRequests(action, args, extra) {
  switch (action) {
    case "CREATE":
      return {
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
    case "COPY":
      return {
        spreadsheetId: args.defaultSSId,
        sheetId: args.defaultSId,
        resource: {
          destinationSpreadsheetId: `${extra.data.spreadsheetId}`,
        },
      };
    case "DELETE":
      return {
        requests: [
          {
            deleteSheet: {
              sheetId: extra.properties.sheetId,
            },
          },
        ],
      };
    case "RENAME":
      return {
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId: extra.data.sheetId,
                title: args.sheet_name ? args.sheet_name : "Default",
              },
              fields: "title",
            },
          },
        ],
      };
  }
}
module.exports = { getRequests };
