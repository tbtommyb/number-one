List of steps to write up into blog post
========================================

* Found releases table on charts website
* Saved local version and used jQuery to pull all <tr> elements
* Used script [insert link] to output to csv
* Used node csv to json to create array of objects
* Used dateFormatter.js to change date to valid SQL datestring
* Used databaseMaker.js to create SQL database
* Created express app and restful api to communicate with dbase (put server.js in root)

Back-end stuff finished!

* Tried to have separate backbone files according to Yeoman generator but it's easier to just put in one file (v small project)
* Build backbone file to query database and hold results in model, render to page
* Next is to take user input and pass to backbone