"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var routes_1 = __importDefault(require("./routes"));
var app = (0, express_1["default"])();
var address = '127.0.0.1:3000';
app.use(body_parser_1["default"].json());
app.use('/api', routes_1["default"]);
app.listen(3000, function () { return console.log("starting app on: ".concat(address)); });
