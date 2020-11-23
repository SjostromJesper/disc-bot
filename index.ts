const {prefix, token} = require('./config.json');
const Discord = require('discord.js');

const {GoogleSpreadsheet} = require('google-spreadsheet');
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

    let success: number = 0;

    const day: number = new Date().getDate();
    const month: number = new Date().getMonth() + 1;
    const date: string = `${day}/${month}`;

    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    await sheet.loadCells('A1:Z75');

    let dateCell: number = 0;
    for (let i = 0; i < 25; i++) {
        console.log(sheet.getCell(0, i).value);
        if (sheet.getCell(0, i).value === date) {
            dateCell = i;
            break;
        }
    }

    if (dateCell === 0) {
        console.log("failed to find date " + date);
        success = -1;
        return success
    }

    if (dateCell !== 0) {
        for (let i = 0; i < 75; i++) {
            if (sheet.getCell(i, 0).value === null) {
                break;
            } else if (sheet.getCell(i, 0).value.toLowerCase().includes(fName)) {
                console.log(sheet.getCell(i, 1).value);
                if (sheet.getCell(i, 1).value === null) {
                    break;
                } else if (sheet.getCell(i, 1).value.toLowerCase().startsWith(lName)) {
                    console.log("found");
                    const attending: any = sheet.getCell(i, dateCell);
                    if (attending.value === 'J') {
                        console.log("attendance already set");
                        success = 2;
                    } else {
                        attending.value = 'J';
                        success = 1;
                    }
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

const words = ['!bot', '!links', '!närvaro'];

client.on('message', (message) => {
    let mess = message.content.toLowerCase();


    if(message.channel.id === "754790321556291745") {
        if (mess.startsWith(`${prefix}bot`)) {
            message.channel.send("This is me: <https://github.com/SjostromJesper/disc-bot>")
        }

        if (mess.startsWith(`${prefix}närvaro`)) {
            attendance(message);
        } else if (mess.startsWith(`${prefix}links`)) {
            links(message);
        }
    }
    else if(words.includes(message.content)) {
        message.channel.send('Please visit me in "#bot-kommandon" instead.')
    }



    // if (message.content.startsWith(`${prefix}user`)) {
    //     const taggedUser = message.mentions.users.first();
    //     message.author.send(taggedUser.username);
    // }
});

const frontendKurserMeet = "https://meet.google.com/lookup/ehccdumqux";
const arbetsmetodikMeet = "https://meet.google.com/lookup/gseu5eqhyr";

function links(message) {
    message.channel.send(
        "meet - <" + frontendKurserMeet +">\n" +
        "terminsplanering - <https://docs.google.com/document/d/1rmcEwQep4ztgzyesjEbxzxsVwfACHr1HS3YJz68FZvY/edit?usp=sharing>\n" +
        "resursdokument - <https://docs.google.com/document/d/169JysyJbK0pD4FwdL9UHYcr0l1k5UYhpM9SQpHW2dRA/edit?usp=sharing>\n" +
        "närvaro - <https://docs.google.com/spreadsheets/d/1xFO3eEhJnBrklrU94K6TVEM38Vaf2aFYOqrUasMRtOY/edit?usp=sharing>\n" +
        "hjälpkön - <https://docs.google.com/document/d/18vpGQhb9IBIcqzjADvKtTh2Wbpnbu3S1CIPc6-kpVis/edit?usp=sharing>");
}

function attendance(message) {
    const person: Array<string> = message.member.displayName.split(" ");
    if (person.length >= 2) {
        setAttending(person[0].toLowerCase(), person[1].toLowerCase()).then((data: number) => {
            if (data === 1) {
                message.channel.send(`Närvaro har satts för: ${message.member.displayName}`);
            } else if (data === 2) {
                message.channel.send(`Du har redan markerat ditt revir idag, ${message.member.displayName}.`);
            } else if (data === -1) {
                message.channel.send("Ingen obligatorisk närvaro idag.");
            } else if (data === 0) {
                message.channel.send(`${message.member.displayName} finns inte i dokumentet.\n Kolla så ditt användarnamn på discord stämmer överens med ditt namn i närvarolistan.`);
            }
        });
    } else {
        message.channel.send(`Kolla så ditt användarnamn på discord stämmer överens med ditt namn i närvarolistan.`);
    }
}

client.login(token);
