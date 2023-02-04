"use strict";

const httpStatus = require("http-status-codes");

exports.logErrors = (err, req, res, next) => {
    console.error("there is an ERROR!", err.stack);
    next(err);
};
exports.resourceNotFound = (req, res) => {
    let errorCode = httpStatus.NOT_FOUND;
    res.status(errorCode);
    res.sendFile(`./public/${errorCode}.html`, { root: "./"});
};
exports.hasInternalError = (err, req, res, next) => {
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    console.log(`ERROR occured: ${err.stack}`)
    res.status(errorCode);
    res.send(`${errorCode} | Sorry, our application is experiencing issues`);
};