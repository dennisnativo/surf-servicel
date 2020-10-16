"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var header_1 = __importDefault(require("./app/middlewares/header"));
var xmlToJson_1 = __importDefault(require("./app/middlewares/xmlToJson"));
var ServCelController_1 = __importDefault(require("./app/controllers/ServCelController"));
var routes = express_1.Router();
var uri = process.env.APP_URI;
routes.all('*', header_1.default);
routes.all('*', xmlToJson_1.default);
routes.route(uri + '/consultaTelefone')
    .post(ServCelController_1.default.index);
routes.route(uri + '/recargaTelefone')
    .post(ServCelController_1.default.store);
exports.default = routes;
