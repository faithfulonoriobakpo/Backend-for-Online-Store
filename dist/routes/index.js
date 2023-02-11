"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var products_1 = __importDefault(require("./api/products"));
var routes = express_1["default"].Router();
routes.use('/api', products_1["default"]);
exports["default"] = routes;
