
module.exports = function(req, res, next) {
    if(!(req.body.name && req.body.password)) {
        return res.status(400).send({
            success: false,
            message: 'Name, password and admin data not in correct format'
        });
    }
    req.newUser = [
        req.body.password,
        req.body.admin || false,
        req.body.name
    ];
    next();
};
