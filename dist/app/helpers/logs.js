"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveControllerLogs = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = require("fs");
var dateFormat = require("dateformat");
function logBuilder(data, requestExtraData) {
    if (requestExtraData === void 0) { requestExtraData = {}; }
    var headerDate = new Date();
    headerDate.setHours(headerDate.getHours() - 3);
    return headerDate.toISOString().replace(/[TZ]/g, ' ') + "- " + data + " | Request: " + JSON.stringify(requestExtraData) + "\n";
}
function saveControllerLogs(dataToSave, requestExtraData, controller) {
    if (requestExtraData === void 0) { requestExtraData = {}; }
    var today = dateFormat(new Date(), 'yyyy-mm-dd');
    var ControllerLogsPath = path_1.default.resolve(__dirname, '..', '..', '..', 'logs', controller, today + ".log");
    var stream = fs_1.createWriteStream(ControllerLogsPath, {
        flags: 'a'
    });
    stream.on('open', function () {
        stream.write(logBuilder(dataToSave, requestExtraData));
        stream.close();
    });
}
exports.saveControllerLogs = saveControllerLogs;
