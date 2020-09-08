const express = require('express');
const { response } = require('express');
const app = express();
const RPC = require('discord-rpc');
const clientId = '562001419503140909';
const scopes = ['rpc', 'rpc.api', 'messages.read'];
const client = new RPC.Client({ transport: 'ipc' });
app.use(express.static("public"));
app.get("/", (request, response) => {
	response.sendFile(__dirname + "/views/index.html");
});

app.get("/discord", async (request, response) => {
	let req = request.query

	let userDetails = req.status
	let userState = req.custom
	let x = req.timestamp

	function getDate(input) {
		var z = new Date(input);
		var int = z.getTime()/1000.0;
		return int;
	}
	console.log(getDate(x))
	client.on('ready', () => {
		console.log('Authed for user', client.user.username);
		client.clearActivity();
		client.setActivity({
			details: `${userDetails}`,
			state: `${userState}`,
			endTimestamp: getDate(x),
			instance: false,
		});
	});
	client.login({ clientId });
	response.json({"success":true})
})
const listener = app.listen("80", () => {
	console.log("Your app is listening on port " + listener.address().port);
});
