"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.authenticate = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware function to authenticate requests
var authenticate = function (req, res, next) {
    // get token from the headers
    var authorization = req.headers.authorization;
    var token = req.body.token || req.query.token || req.params.token || (authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1]);
    if (!token) {
        return res.status(401).json({ status: 401, message: "Access Denied. No Token Provided." });
    }
    try {
        jsonwebtoken_1["default"].verify(token, process.env.JWT_SECRET);
        next();
    }
    catch (ex) {
        return res.status(401).json({ status: 401, message: "Access Denied. Invalid Token Provided." });
    }
};
exports.authenticate = authenticate;
