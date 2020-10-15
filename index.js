var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a = require('./config.json'), prefix = _a.prefix, token = _a.token;
var Discord = require('discord.js');
var GoogleSpreadsheet = require('google-spreadsheet').GoogleSpreadsheet;
var creds = require('./credentials.json');
var client = new Discord.Client();
var doc = new GoogleSpreadsheet('1xFO3eEhJnBrklrU94K6TVEM38Vaf2aFYOqrUasMRtOY');
function accessSpreadsheet() {
    return __awaiter(this, void 0, void 0, function () {
        var sheet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doc.useServiceAccountAuth({
                        client_email: creds.client_email,
                        private_key: creds.private_key
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, doc.loadInfo()];
                case 2:
                    _a.sent();
                    console.log(doc.title);
                    sheet = doc.sheetsByIndex[0];
                    console.log(sheet.title);
                    console.log(sheet.rowCount);
                    return [2 /*return*/, [sheet.title, sheet.rowCount]];
            }
        });
    });
}
function setAttending(fName, lName) {
    return __awaiter(this, void 0, void 0, function () {
        var success, day, month, date, sheet, dateCell, i, i, attending;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("seaching for " + fName + " " + lName);
                    success = 0;
                    day = new Date().getDate();
                    month = new Date().getMonth() + 1;
                    date = day + "/" + month;
                    return [4 /*yield*/, doc.useServiceAccountAuth({
                            client_email: creds.client_email,
                            private_key: creds.private_key
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, doc.loadInfo()];
                case 2:
                    _a.sent();
                    sheet = doc.sheetsByIndex[0];
                    return [4 /*yield*/, sheet.loadCells('A1:J75')];
                case 3:
                    _a.sent();
                    dateCell = 0;
                    for (i = 0; i < 10; i++) {
                        console.log(sheet.getCell(0, i).value);
                        if (sheet.getCell(0, i).value === date) {
                            dateCell = i;
                            break;
                        }
                    }
                    if (dateCell === 0) {
                        console.log("failed to find date " + date);
                        success = -1;
                        return [2 /*return*/, success];
                    }
                    if (dateCell !== 0) {
                        for (i = 0; i < 75; i++) {
                            if (sheet.getCell(i, 0).value === null) {
                                break;
                            }
                            else if (sheet.getCell(i, 0).value.toLowerCase().includes(fName)) {
                                console.log(sheet.getCell(i, 1).value);
                                if (sheet.getCell(i, 1).value === null) {
                                    break;
                                }
                                else if (sheet.getCell(i, 1).value.toLowerCase().startsWith(lName)) {
                                    console.log("found");
                                    attending = sheet.getCell(i, dateCell);
                                    if (attending.value === 'J') {
                                        console.log("attendance already set");
                                        success = 2;
                                    }
                                    else {
                                        attending.value = 'J';
                                        success = 1;
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    return [4 /*yield*/, sheet.saveUpdatedCells()];
                case 4:
                    _a.sent();
                    return [2 /*return*/, success];
            }
        });
    });
}
client.once('ready', function () {
    console.log("live!");
});
var words = ['!bot', '!links', '!närvaro'];
client.on('message', function (message) {
    if (message.channel.id === "754790321556291745") {
        if (message.content.startsWith(prefix + "bot")) {
            message.channel.send("This is me: <https://github.com/SjostromJesper/disc-bot>");
        }
        if (message.content.startsWith(prefix + "n\u00E4rvaro")) {
            attendance(message);
        }
        else if (message.content.startsWith(prefix + "links")) {
            links(message);
        }
    }
    else if (words.includes(message.content)) {
        message.channel.send('Please visit me in "#bot-kommandon" instead.');
    }
    // if (message.content.startsWith(`${prefix}user`)) {
    //     const taggedUser = message.mentions.users.first();
    //     message.author.send(taggedUser.username);
    // }
});
function links(message) {
    message.channel.send("meet - <https://meet.google.com/lookup/ehccdumqux>\n" +
        "terminsplanering - <https://docs.google.com/document/d/1rmcEwQep4ztgzyesjEbxzxsVwfACHr1HS3YJz68FZvY/edit?usp=sharing>\n" +
        "resursdokument - <https://docs.google.com/document/d/169JysyJbK0pD4FwdL9UHYcr0l1k5UYhpM9SQpHW2dRA/edit?usp=sharing>\n" +
        "närvaro - <https://docs.google.com/spreadsheets/d/1xFO3eEhJnBrklrU94K6TVEM38Vaf2aFYOqrUasMRtOY/edit?usp=sharing>\n" +
        "hjälpkön - <https://docs.google.com/document/d/18vpGQhb9IBIcqzjADvKtTh2Wbpnbu3S1CIPc6-kpVis/edit?usp=sharing>");
}
function attendance(message) {
    var person = message.member.displayName.split(" ");
    if (person.length === 2) {
        setAttending(person[0].toLowerCase(), person[1].toLowerCase()).then(function (data) {
            if (data === 1) {
                message.channel.send("N\u00E4rvaro har satts f\u00F6r: " + message.member.displayName);
            }
            else if (data === 2) {
                message.channel.send("Du har redan markerat ditt revir idag, " + message.member.displayName + ".");
            }
            else if (data === -1) {
                message.channel.send("Ingen obligatorisk närvaro idag.");
            }
            else if (data === 0) {
                message.channel.send(message.member.displayName + " finns inte i dokumentet.\n Kolla s\u00E5 ditt anv\u00E4ndarnamn p\u00E5 discord st\u00E4mmer \u00F6verens med ditt namn i n\u00E4rvarolistan.");
            }
        });
    }
    else {
        message.channel.send("Kolla s\u00E5 ditt anv\u00E4ndarnamn p\u00E5 discord st\u00E4mmer \u00F6verens med ditt namn i n\u00E4rvarolistan.");
    }
}
client.login(token);
