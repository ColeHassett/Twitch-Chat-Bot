const tmi = require('tmi.js');
const fs = require('fs');

// Define configuration options
const opts = require('./config');

// HTTP server to keep Glitch from sleeping
const keepalive = require('./keepalive');
keepalive.start(opts.port);

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

var sc;

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot
  
    // Break message into array and establish first element as the command
    var message = msg.split(" ");
    var cmd = message[0];

    // Check for SC Emotes
    if (message.some((el) => el === '-20' || el === '+20')) {
        message.forEach(word => {
            if (word === '+20') {
                sc += 20;
            }
            else if (word === '-20') {
                sc -= 20;
            }
        });
        updateSC();
    }

    // Report SC
    if (message[0] === '!sc') {
        reportSC(target);
    }
}

function updateSC() {
    fs.writeFile('sc.txt', sc, (err) => {
        if (err) {
            return console.log("File Write Error:\n", err);
        }
        console.log('SC Updated');
    });
}

function reportSC(target) {
    client.say(target, `Binguu's Social Credit: ${sc}`);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
    fs.readFile('sc.txt', 'utf8', (err, data) => {
        if (err) {
            return console.log("File Read Error:\n", err);
        }
        sc = parseInt(data);
    });
}