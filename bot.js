const tmi = require('tmi.js');
const fs = require('fs');

Define configuration options
const opts = {
    identity: {
        username: env.BOT_USERNAME,
        password: env.OAUTH_TOKEN
    },
    channels: [
        env.CHANNEL_NAME
    ]
};

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
  
    var message = msg.split(" ");
    var cmd = message[0];

    // Check for SC Emotes
    if (message.includes('-20')) {
        message.forEach(word => {
            if (word === '+20') {
                updateSC(0);
            }
        });
    }
    else if (message.includes('+20')) {
        message.forEach(word => {
            if (word === '+20') {
                updateSC(1);
            }
        });
    }

    // Report SC
    if (message[0] === '!sc') {
        reportSC(target);
    }
}

function updateSC(bool) {
    bool > 0 ? sc += 20 : sc -= 20;

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