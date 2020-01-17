"use strict";
exports.__esModule = true;
var dotenv = require("dotenv");
var express_1 = require("express");
var cors_1 = require("cors");
var helmet_1 = require("helmet");
dotenv.config();
var PORT = parseInt(process.env.PORT, 10);
var RIOT_API_KEY = process.env.PORT;
var app = express_1["default"]();
app.use(helmet_1["default"]());
app.use(cors_1["default"]());
app.use(express_1["default"].static('public'));
app.use(express_1["default"].json());
var server = app.listen(PORT, function () {
    console.log("Listening on port " + PORT);
});
