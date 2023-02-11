"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var pg_1 = require("pg");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1["default"].config();
var _a = process.env, POSTGRES_HOST = _a.POSTGRES_HOST, POSTGRES_DATABASE = _a.POSTGRES_DATABASE, POSTGRES_USERNAME = _a.POSTGRES_USERNAME, POSTGRES_PASSWORD = _a.POSTGRES_PASSWORD;
var Client = new pg_1.Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    user: POSTGRES_USERNAME,
    password: POSTGRES_PASSWORD
});
exports["default"] = Client;
