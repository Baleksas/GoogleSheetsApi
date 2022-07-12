Required files to run the functions:

client-secret.json

{
"installed": {
...
}
}

It contains:
client_secret,
client_id,
redirect_uris

It's required in the authorize function to create a new token.
After creating client-secret.json in a src folder, run `node index.js` from the src directory.

Then in the console the URL will be provided which you need to press in order to authorize this app.

In the bottom line of the console, there should be a line:
`Enter the code from that page here: `

You can get this code after logging in with the given URL and copying the code from the search bar. It should look something like this:
4%2F0AdQt8qhWtRUA5QKCSdnBkBaoIpzUoSSocxSYDVbw0BPr-e9V1r_oHGfAP9ENwtMT5rpuWw.
You should cut it from the URL in a search bar:
http://localhost:8000/?code=4%2F0AdQt8qhWtRUA5QKCSdnBkBaoIpzUoSSocxSYDVbw0BPr-e9V1r_oHGfAP9ENwtMT5rpuWw&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive

Important: In order to follow following steps, you need to be added to an organization, if not you will receive this error:
![](no-access.png)
