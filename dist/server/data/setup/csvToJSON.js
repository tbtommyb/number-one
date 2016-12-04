const fs = require('fs');
const path = require('path');
const Converter = require('csvtojson').Converter;
const jsonfile = require('jsonfile');

const fileStream = fs.createReadStream(path.join(__dirname, 'data.csv'));
const output = path.join(__dirname, 'data.json');

const converter = new Converter({});

converter.on('end_parsed', function(jsonObj) {
    jsonfile.writeFile(output, jsonObj, function(err) {
        console.error(err);
    });
});

fileStream.pipe(converter);
