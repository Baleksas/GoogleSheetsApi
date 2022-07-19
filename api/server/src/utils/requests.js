function getRequests(args) {
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
}
module.exports = { getRequests };
