var _a = require('./config.json'), prefix = _a.prefix, token = _a.token, firebaseConfig = _a.firebaseConfig;
var Discord = require('discord.js');
var firebase = require('firebase');
require('firebase/firestore');
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var client = new Discord.Client();
client.once('ready', function () {
    console.log("ready!");
});
client.on('message', function (message) {
    if (message.content.startsWith(prefix + "bot")) {
        message.channel.send("I'm under construction!");
    }
    else if (message.content === prefix + "firebase") {
        db.collection("users").doc(message.author.username).set({
            username: message.author.username,
            someData: "data"
        })
            .then(function () {
            console.log("Document successfully written!");
            message.channel.send("success");
        })["catch"](function (error) {
            console.error("Error writing document: ", error);
            message.channel.send("error");
        });
    }
    else if (message.content.startsWith(prefix + "links")) {
        message.channel.send("terminsplanering - <https://docs.google.com/document/d/1rmcEwQep4ztgzyesjEbxzxsVwfACHr1HS3YJz68FZvY/edit>\n" +
            "resursdokument - <https://docs.google.com/document/d/169JysyJbK0pD4FwdL9UHYcr0l1k5UYhpM9SQpHW2dRA/edit>\n" +
            "närvaro - <https://docs.google.com/spreadsheets/d/1xFO3eEhJnBrklrU94K6TVEM38Vaf2aFYOqrUasMRtOY/edit#gid=0>\n" +
            "hjälpkön - <https://docs.google.com/document/d/18vpGQhb9IBIcqzjADvKtTh2Wbpnbu3S1CIPc6-kpVis/edit>");
    }
    // if (message.content.startsWith(`${prefix}user`)) {
    //     const taggedUser = message.mentions.users.first();
    //     message.author.send(taggedUser.username);
    // }
});
client.login(token);
