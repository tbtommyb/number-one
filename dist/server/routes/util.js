
const serveRows = function(req, res) {
    return function(err, rows) {
        if(err) return res.status(err.status || 500).send(err);
        if(!rows.length) {
            return res.status(404).send({
                success: false,
                message: 'Resource not found'
            });
        }
        res.contentType('application/json');
        res.json(rows);
    };
};

const handleInsert = function(req, res) {
    return function(err, id) {
        if(err) return res.status(err.status || 500).send(err);
        res.status(201).send({
            success: true,
            message: `Record ${id} updated`
        });
    };
};

const handleChange = function(req, res) {
    return function(err, changes) {
        if(err) return res.status(err.status || 500).send(err);
        if(!changes) {
            return res.status(404).send({
                success: false,
                message: 'Resource not found'
            });
        }
        res.status(200).send({
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
