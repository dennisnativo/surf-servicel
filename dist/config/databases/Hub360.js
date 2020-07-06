"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configDatabase = exports.password = exports.username = exports.database = void 0;
exports.database = process.env.DB_HUB360_DATABASE || '';
exports.username = process.env.DB_USERNAME || '';
exports.password = process.env.DB_PASSWORD || '';
exports.configDatabase = {
    dialect: 'mssql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '0'),
    dialectOptions: {
        instanceName: process.env.DB_INSTANCENAME
    },
    database: exports.database
};
