Number One
==========

This little app finds what was number one on your birthday (in the UK) and finds the song on Youtube.

On the client side, it's a Backbone app with a little bit of jQuery for styling.

On the back-end, it's an Express server connecting to an sqlite3 database.

It has a full RESTful API, accessible at /api. This allows new users to register via basic auth (over HTTPS) and allocates users a JSON web token. Providing the token along with requests allows the user to pull record information from the database. Users with admin status can amend the record and user databases.

