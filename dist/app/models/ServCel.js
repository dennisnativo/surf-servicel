"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var sequelize_1 = require("sequelize");
var request_promise_1 = __importDefault(require("request-promise"));
var database_1 = __importDefault(require("../../database"));
var ServCel = /** @class */ (function () {
    function ServCel() {
    }
    ServCel.procInsServCel = function (metodo, phase, codResposta, plintron, request) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("exec HUB360.[recharge].[INS_SERVCEL] \n        @metodo=N'" + metodo + "',\n        @phase=" + phase + ",\n        @msisdn=N'" + request.msisdn + "',\n        @valor=N'" + request.valor + "',\n        @origem=" + request.origem + ",\n        " + ((request.dataOrigem !== '') ? "@dataOrigem=N'" + request.dataOrigem + "'," : '') + "\n        " + ((request.dataServCel !== '') ? "@dataServCel=N'" + request.dataServCel + "'," : '') + "\n        " + ((request.nsuOrigem !== '') ? "@nsuOrigem=N'" + request.nsuOrigem + "'," : '') + "\n        " + ((request.nsuServCel !== '') ? "@nsuServCel=N'" + request.nsuServCel + "'," : '') + "\n        @produto=" + request.produto + ",\n        " + ((request.chave !== '') ? "@chave=N'" + request.chave + "'," : '') + "\n        @operadora=" + request.operadora + "\n        " + ((codResposta !== '') ? ", @codResposta=N'" + codResposta + "'" : '') + "\n        " + ((plintron !== null) ? ", @plintron=" + plintron : ''), { type: sequelize_1.QueryTypes.SELECT })
                            .then(function (response) {
                            return response[0];
                        })
                            .catch(function (err) {
                            console.log(err);
                            return null;
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ServCel.procGetCodResposta = function (msisdn, metodo) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("exec HUB360.[recharge].[USP_GET_CODRESPOSTA] \n        @msisdn=N'" + msisdn + "', @metodo=N'" + metodo + "'", { type: sequelize_1.QueryTypes.SELECT })
                            .then(function (response) {
                            return response[0];
                        })
                            .catch(function (err) {
                            console.log(err);
                            return null;
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ServCel.procCheckPlintron = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query('SELECT TOP (1) [plintron] FROM [Hub360].[recharge].[tb_servCel_checkPlintron]', { type: sequelize_1.QueryTypes.SELECT })
                            .then(function (response) {
                            return response[0];
                        })
                            .catch(function (err) {
                            console.log(err);
                            return null;
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.plintron];
                }
            });
        });
    };
    ServCel.procGetAuth = function (msisdn, operadora) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("Exec [Hub360].[recharge].[USP_SERVCEL_GETAUTH]\n      @msisdn=N'" + msisdn + "',\n      @operadora=N'" + operadora + "'", { type: sequelize_1.QueryTypes.SELECT })
                            .then(function (response) {
                            return response[0];
                        })
                            .catch(function (err) {
                            console.log(err);
                            return null;
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ServCel.procInsPlintron = function (auth, requestData) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("Exec [Hub360].[recharge].[INS_SERVCEL_PLINTRON]\n        @authentication=N'" + auth + "',\n        @produtoID=N'" + requestData.productID + "',\n        @transactionID=N'" + requestData.transactionID + "',\n        @msisdn=N'" + requestData.MSISDN + "',\n        @amount=N'" + requestData.amount + "',\n        @terminalID=N'" + requestData.terminalID + "',\n        @currency=N'" + requestData.currency + "',\n        @cardID=N'" + requestData.cardID + "',\n        @retailerID=N'" + requestData.retailerID + "',\n        @phase=" + requestData.twoPhaseCommit, { type: sequelize_1.QueryTypes.SELECT })
                            .then(function (response) {
                            return response[0];
                        })
                            .catch(function (err) {
                            console.log(err);
                            return null;
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ServCel.procTopUp = function (auth, requestData) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                response = request_promise_1.default({
                    uri: 'http://192.168.120.25/Hub360/topUp',
                    headers: {
                        Authorization: auth
                    },
                    formData: __assign({}, requestData),
                    method: 'POST'
                }).then(function (response) {
                    return JSON.parse(response);
                }).catch(function (err) {
                    // console.log(err)
                    return err;
                });
                return [2 /*return*/, response];
            });
        });
    };
    ServCel.procNuage = function (msisdn) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                response = request_promise_1.default({
                    uri: 'https://www.pagtel.com.br/Nuage-teste/api/v1/conta',
                    body: {
                        msisdn: '55' + msisdn
                    },
                    method: 'POST',
                    json: true
                }).then(function (response) {
                    return (response.sucesso === 0);
                }).catch(function (err) {
                    console.log(err);
                    return false;
                });
                return [2 /*return*/, response];
            });
        });
    };
    ServCel.procRecargaNuage = function (entrada) {
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
    return ServCel;
}());
exports.default = ServCel;
