"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_promise_1 = __importDefault(require("request-promise"));
var database_1 = __importDefault(require("../../database"));
var logs_1 = require("../helpers/logs");
var Nuage = /** @class */ (function () {
    function Nuage() {
    }
    Nuage.saveContaOnDb = function (_a) {
        var _b = _a.msisdn, msisdn = _b === void 0 ? '' : _b, _c = _a.accountId, accountId = _c === void 0 ? null : _c, _d = _a.iccid, iccid = _d === void 0 ? null : _d, _e = _a.transactionId, transactionId = _e === void 0 ? null : _e, _f = _a.phase, phase = _f === void 0 ? '' : _f, _g = _a.requestBody, requestBody = _g === void 0 ? '' : _g, _h = _a.requestHeader, requestHeader = _h === void 0 ? '' : _h, _j = _a.responseBody, responseBody = _j === void 0 ? '' : _j;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_k) {
                return [2 /*return*/, database_1.default.query("exec nuage.INS_SPEC_CONTA\n          @msisdn = ?,\n          @transaction_id = ?,\n          @phase = ?,\n          @request_body = ?,\n          @request_header = ?,\n          @response_body = ?,\n          @created_at = ?,\n          @updated_at = ?,\n          @account_id = ?,\n          @iccid = ?\n        ", {
                        replacements: [
                            msisdn, transactionId, phase, requestBody, requestHeader, responseBody, new Date(), new Date(), accountId, iccid
                        ]
                    })];
            });
        });
    };
    Nuage.procNuage = function (msisdn) {
        return __awaiter(this, void 0, void 0, function () {
            var body, proc200Response, response, phase, responseBody, proc210Response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = { msisdn: '55' + msisdn };
                        logs_1.saveControllerLogs('INICIO            ', body, 'conta-controller');
                        return [4 /*yield*/, this.saveContaOnDb({
                                msisdn: '55' + msisdn,
                                accountId: null,
                                iccid: null,
                                phase: '200',
                                requestBody: JSON.stringify(body),
                                requestHeader: JSON.stringify({})
                            })];
                    case 1:
                        proc200Response = _a.sent();
                        logs_1.saveControllerLogs('PROC 200 RESPONSE ', { body: body, proc200Response: proc200Response }, 'conta-controller');
                        return [4 /*yield*/, request_promise_1.default({
                                uri: "https://plataforma.surfgroup.com.br/api/spec/v1/conta/55" + msisdn,
                                method: 'GET',
                                json: true
                            }).then(function (response) {
                                return response;
                            }).catch(function (err) {
                                console.log(err);
                                return false;
                            })];
                    case 2:
                        response = _a.sent();
                        phase = '210';
                        responseBody = '';
                        if (!response || response.erro) {
                            phase = '99';
                            responseBody = '';
                        }
                        else {
                            responseBody = JSON.stringify(response);
                        }
                        logs_1.saveControllerLogs('POS-REQUEST-NUAGE ', { body: body, response: response }, 'conta-controller');
                        return [4 /*yield*/, this.saveContaOnDb({
                                msisdn: msisdn,
                                accountId: null,
                                iccid: null,
                                transactionId: response.transacao ? response.transacao : null,
                                phase: phase,
                                requestBody: JSON.stringify(body),
                                requestHeader: JSON.stringify({}),
                                responseBody: responseBody
                            })];
                    case 3:
                        proc210Response = _a.sent();
                        logs_1.saveControllerLogs("PROC " + phase + " RESPONSE ", { body: body, proc210Response: proc210Response }, 'conta-controller');
                        logs_1.saveControllerLogs('FINAL             ', body, 'conta-controller');
                        return [2 /*return*/, response];
                }
            });
        });
    };
    Nuage.procRecargaNuage = function (entrada) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                response = request_promise_1.default({
                    uri: 'https://www.pagtel.com.br/Nuage-teste/api/v1/recarga',
                    body: {
                        msisdn: entrada.msisdn,
                        valor: entrada.valor,
                        dtExecucao: entrada.dtExecucao,
                        origem: entrada.origem,
                        nsu: entrada.nsu
                    },
                    method: 'POST',
                    json: true
                }).then(function (response) {
                    return response;
                }).catch(function (err) {
                    console.log(err);
                    return false;
                });
                return [2 /*return*/, response];
            });
        });
    };
    return Nuage;
}());
exports.default = Nuage;
