const app = require('./server.js');

/*** Initialise ***/
const port = process.env.PORT || 9000;
console.log('initialising server on port ', port);

const server = app.listen(port);

module.exports = server;
