var fs = require('fs');
var Converter = require("csvtojson").Converter;
var jsonfile = require('jsonfile');

var fileStream = fs.createReadStream("./data.csv");
var output = './data.json';

var param = {};

var converter = new Converter(param);

converter.on("end_parsed", function (jsonObj) {
	jsonfile.writeFile(output, jsonObj, function(err) {
		console.error(err);
	})
});

fileStream.pipe(converter);