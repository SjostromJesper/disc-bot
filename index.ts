const {prefix, token} = require('./config.json');
const Discord = require('discord.js');


const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./credentials.json');

const client = new Discord.Client();


const doc = new GoogleSpreadsheet('1xFO3eEhJnBrklrU94K6TVEM38Vaf2aFYOqrUasMRtOY');

async function accessSpreadsheet() {
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
    });

    await doc.loadInfo();
    console.log(doc.title);

    const sheet = doc.sheetsByIndex[0];
    console.log(sheet.title);
    console.log(sheet.rowCount);

    return [sheet.title, sheet.rowCount]
}


async function setAttending(fName, lName) {
    console.log("seaching for " + fName + " " + lName);

    let success = false;

    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const date = `${day}/${month}`;

    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    await sheet.loadCells('A1:J75');

    let dateCell = 0;
    for(let i = 0 ; i < 10 ; i++) {
        if(sheet.getCell(0, i).value === date) {
            dateCell = i;
        }
    }

    if(dateCell !== 0) {
        for(let i = 0 ; i < 75 ; i++) {
            console.log(sheet.getCell(i, 0).value);
            if(sheet.getCell(i, 0).value.toLowerCase().includes(fName)) {
                console.log(sheet.getCell(i, 1).value);
                if(sheet.getCell(i, 1).value.toLowerCase().startsWith(lName)) {
                    console.log("found");
                    const attending = sheet.getCell(i, dateCell);
                    attending.value = 'J';
                    success = true;
                    break;
                }
            }
        }
    }
    await sheet.saveUpdatedCells();
    return success;
}

client.once('ready', () => {
    console.log("live!");
});

client.on('message', (message) => {

    if(message.content.startsWith(`${prefix}links`)) {
        message.channel.send(
            "meet - <https://meet.google.com/fyy-gjzb-aqq>\n" +
            "terminsplanering - <https://docs.google.com/document/d/1rmcEwQep4ztgzyesjEbxzxsVwfACHr1HS3YJz68FZvY/edit?usp=sharing>\n" +
            "resursdokument - <https://docs.google.com/document/d/169JysyJbK0pD4FwdL9UHYcr0l1k5UYhpM9SQpHW2dRA/edit?usp=sharing>\n" +
            "närvaro - <https://docs.google.com/spreadsheets/d/1xFO3eEhJnBrklrU94K6TVEM38Vaf2aFYOqrUasMRtOY/edit?usp=sharing>\n" +
            "hjälpkön - <https://docs.google.com/document/d/18vpGQhb9IBIcqzjADvKtTh2Wbpnbu3S1CIPc6-kpVis/edit?usp=sharing>");
    }
    else if(message.content.startsWith(`${prefix}närvaro`)) {
        const person = message.member.displayName.split(" ");
        if(person.length === 2) {
            setAttending(person[0].toLowerCase(), person[1].toLowerCase()).then((data) => {
                if(data) {
                    message.channel.send(`närvaro har satts för: ${message.member.displayName}`);
                }
                else {
                    message.channel.send(`finns inte i dokumentet: ${message.member.displayName}. eller så är det inte obligatorisk närvaro idag. kan också vara så att jesper suger på att programmera`);
                }
            });
        }
        else {
            message.channel.send(`ditt användarnamn är inte korrekt`);
        }
    }

    // if (message.content.startsWith(`${prefix}user`)) {
    //     const taggedUser = message.mentions.users.first();
    //     message.author.send(taggedUser.username);
    // }
});

client.login(token);
