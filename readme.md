Number One
==========

This little app finds what was number one on your birthday (in the UK) and finds the song on Youtube.

On the back end it's an Express server connecting to an sqlite3 database. The front end was originally built on Backbone but I took that out as it seemed completely overkill. It currently uses a few jQuery plugins but in the near future I would like to remove them and just use pure JS for everything. It uses Grunt and Bower for task running and packaging up the front end dependencies.

It has a full RESTful API, accessible at /api. This allows new users to register via basic auth (for demo purposes only, obviously) and allocates users a JSON web token. Querying the records endpoint is open to all but accessing information on users or changing the records database requires authentication and authorisation as an admin.

TODO

* Fix Grunt issue creating nested server directories.
* Prettify API page.