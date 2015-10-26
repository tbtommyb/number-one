var fs = require('fs');
var jsonfile = require('jsonfile');

var content = JSON.parse(fs.readFileSync(__dirname + '/data.json', 'utf8'));

for (var i = 0; i < content.length; i++) {
	var date = content[i].Date;
	var newDate = date.split('/').reverse().join('-');
	content[i].Date = newDate;
}

jsonfile.writeFile('newData.json', content, function(err) {
		console.error(err);
});
