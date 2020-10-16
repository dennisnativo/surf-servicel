"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var Hub360_1 = require("./config/databases/Hub360");
var sequelizeHub360 = new sequelize_1.Sequelize(Hub360_1.database, Hub360_1.username, Hub360_1.password, Hub360_1.configDatabase);
exports.default = sequelizeHub360;
