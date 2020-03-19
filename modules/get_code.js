const fs = require('fs'); // https://nodejs.org/api/fs.html
const { clog } = require('./util');

// Exceptional Code
const seoul = '1100000000';
const districtCodes = ['1121500000', '1130500000', '1154500000'];

/*
const path = "./modules/data/district_code_capital_area.txt";
fs.readFile(path, { encoding: 'utf8' }, function (err, data) {
    if (err) throw err;
    const separator = "\r\n";
    // const buffer = Buffer.from(data);
    // log(("\r").charCodeAt()); // CR(13)
    // log(("\n").charCodeAt()); // LF(10)
    let arr = data.split(separator); // CR(13) LF(10)
    let newArr = arr.filter(v => v.slice(-2) !== "폐지"); // 존재
    let newData = newArr.join(separator);

    // ascii (not utf8)
    // log(String.fromCharCode(97)); // a, ascii -> string
    // log(("a").charCodeAt()); // 97, string -> ascii
    // log((97).toString(16)); // 61, ascii -> hex 
    // log(parseInt("0x61")); // 97, hex -> decimal

    let file = "./modules/data/district_code_capital_filtered.txt";
    fs.writeFile(file, newData, { encoding: 'utf8' }, (err) => { if (err) log(err) });
});
*/

/*
const path = "./modules/data/district_code_capital_filtered.txt";
fs.readFile(path, { encoding: 'utf8' }, function (err, data) {
    if (err) throw err;
    const separator = "\r\n";
    let arr = data.split(separator); // CR(13) LF(10)
    let newArr = arr.filter(v => v.slice(-2) !== "폐지"); // 존재
    let newArr2 = [];
    for (let i = 1; i < newArr.length; i++) {
        let newItemArr = newArr[i].split(/[" "\t]/);
        newItemArr.pop();
        let length = newItemArr.length;

        // if (length == 2) log(length, newItemArr); // 2 si
        // if (length == 3) log(length, newItemArr); // 3 gu
        // if (length == 4) log(length, newItemArr); // 4 dong
        // if (length == 5) log(length, newItemArr); // 5 ~ 6 ri
        if (length < 5) {
            let newItem = newItemArr.join(" ");
            newArr2.push(newItem);
        }
    }
    let newData = newArr2.join(separator);
    let file = "./modules/data/district_code_capital_filtered2.txt";
    fs.writeFile(file, newData, { encoding: 'utf8' }, (err) => { if (err) log(err) });
});
*/

let codeObj = {};
let codeArr = [];
const path = "./modules/data/district_code_capital_filtered2.txt";
fs.readFile(path, { encoding: 'utf8' }, function (err, data) {
    if (err) throw err;
    const separator = "\r\n";
    let arr = data.split(separator); // CR(13) LF(10)
    for (let i = 0; i < arr.length; i++) {
        let newItemArr = arr[i].split(" ");
        codeArr.push(newItemArr);
        codeObj[newItemArr[0]] = newItemArr;
    }
    // log(codeObj);
});

/*
// method 2
fs.open("./modules/data/district_code_tmp.txt", "r", function (err, fd) {
    log(Buffer.isBuffer(buf));
    log(fd);

    fs.read(fd, buf, 0, buf.length, null, function (err, bytedRead, buffer) {
        if (err) throw err;
        let inStr = buffer.toString('utf8', 0, bytedRead);
        log(inStr);
        fs.close(fd, () => { log('close') });
    });
});
*/

/*
// method 3
const readline = require('readline'); // https://nodejs.org/api/readline.html
const readInterface = readline.createInterface({
    input: fs.createReadStream("./modules/data/district_code_tmp2.txt"),
    output: process.stdout,
    console: false
});

readInterface.on('line', function (line) {
    console.log(typeof line);
    console.log(line);
});
*/

// '0000000000'
// '1100000000'
// '1144000000'
function getList(depth, code) {
    let list;
    if (depth == 1) {
        let regex = new RegExp("0{8}$");
        list = codeArr.filter(v => regex.test(v[0]));
    } else if (depth == 2) {
        let code2 = code.slice(0, 2);
        let regex = new RegExp(`^${code2}\\d{1,}0{6}$`);
        list = codeArr.filter(v => regex.test(v[0]) && v.length == 3);
        if (code == seoul) { // for exceptional code
            list = [...list, ...codeArr.filter(v => districtCodes.includes(v[0]))]; // Spread syntax
            list.sort((a, b) => a[0] - b[0]);
        }
    } else if (depth == 3) {
        let code2 = code.slice(0, 4);
        let regex = new RegExp(`^${code2}\\d{1,}$`);
        list = codeArr.filter(v => regex.test(v[0]) && v.length == 4);
    }
    return list;
}

function getItem(code) {
    return codeObj[code];
}

let get_code = {
    getItem,
    getList
};

module.exports = get_code;