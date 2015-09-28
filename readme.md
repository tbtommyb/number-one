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

Basic code completed
--------------------

install sass via npm, add task to grunt so that on serve etc it's done automatically
Need to:
* Add in error-checking for server, in case date out of range.
* Add styling.
* Increase functionality

Styling
-------

* Choose suitable colours
* think about compatibility

API integration
---------------

* Add in auto loading of youtube

* Make youtube video update on model change
* Fix grunt file
* Fix paths to public files
* index.html isn't built properly

Left to do
----------

* Blog write up
* Fix up blog - credits, new pics
* Tidy up formatting a little bit more (create new media mixin for iphone screen, change ids to classes, alignments on the page etc). Make go button change colour on hover
* security - ssl, cookies, sql (need to use prepared statements)

* Songkick??