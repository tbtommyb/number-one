
module.exports = function(req, res, next) {
    if(!(req.body.artist && req.body.title && req.body.weeks && req.body.date)) {
        res.status(400).send({
            success: false,
            message: 'Date, artist, title and week data not in correct format'
        });
    }
    req.recordData = [
        req.body.date,
        req.body.artist.toUpperCase(),
        req.body.title.toUpperCase(),
        req.body.weeks
    ];
    next();
};