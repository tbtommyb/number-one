
var serveRows = function(req, res) {
    return function(err, rows) {
        if(err) return res.status(err.status || 500).send(err);
        res.contentType('application/json');
        res.json(rows);
    };
};

var handleInsert = function(req, res) {
    return function(err, id) {
        if(err) return res.status(err.status || 500).send(err);
        res.status(201).send({
            success: true,
            message: `Record ${id} updated`
        });
    };
};

var handleChange = function(req, res) {
    return function(err, changes) {
        if(err) return res.status(err.status || 500).send(err);
        res.status(201).send({
            success: true,
            message: `Following changes made: ${changes}`
        });
    };
};

module.exports = {
    serveRows: serveRows,
    handleInsert: handleInsert,
    handleChange: handleChange
};