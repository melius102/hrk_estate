const log = console.log;
const fs = require('fs'); // https://nodejs.org/api/fs.html
const path = "./public/data/district_code_capital_area.txt";

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

    let file = "./public/data/district_code_capital_filtered.txt";
    fs.writeFile(file, newData, { encoding: 'utf8' }, (err) => { if (err) log(err) });
});

/*
// method 1
fs.open("./public/data/district_code_tmp.txt", "r", function (err, fd) {
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
    input: fs.createReadStream("./public/data/district_code_tmp2.txt"),
    output: process.stdout,
    console: false
});

readInterface.on('line', function (line) {
    console.log(typeof line);
    console.log(line);
});
*/