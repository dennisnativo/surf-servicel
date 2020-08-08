"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var dateformat_1 = __importDefault(require("dateformat"));
var xml2js_1 = __importDefault(require("xml2js"));
var Yup = __importStar(require("yup"));
var ServCel_1 = __importDefault(require("../models/ServCel"));
var buildXml = function (value) {
    var builder = new xml2js_1.default.Builder({
        renderOpts: { pretty: false }
    });
    return builder.buildObject({
        methodResponse: {
            params: {
                member: {
                    name: 'codResposta',
                    value: value
                }
            }
        }
    });
};
var ServCelController = /** @class */ (function () {
    function ServCelController() {
    }
    ServCelController.index = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var statusCode, response, schema;
            var _this = this;
            return __generator(this, function (_a) {
                statusCode = 200;
                response = {
                    codResposta: '10'
                };
                schema = Yup.object().shape({
                    msisdn: Yup.string().required('MSISDN é obrigatório'),
                    valor: Yup.string().required('Valor é obrigatório'),
                    origem: Yup.string().required('Origem é obrigatório'),
                    produto: Yup.string().required('Produto é obrigatório'),
                    operadora: Yup.string().required('Operadora é obrigatório')
                });
                schema.validate(req.body.xml)
                    .then(function (body) { return __awaiter(_this, void 0, void 0, function () {
                    var servCelResponse, checkPlintron, responseGetAuth, dateNow, transactionID, requestTopUp, responseApi;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, ServCel_1.default.procInsServCel('Consulta', 200, '', null, body)];
                            case 1:
                                servCelResponse = _a.sent();
                                return [4 /*yield*/, ServCel_1.default.procCheckPlintron()];
                            case 2:
                                checkPlintron = _a.sent();
                                return [4 /*yield*/, ServCel_1.default.procNuage(body.msisdn)];
                            case 3:
                                if (!_a.sent()) return [3 /*break*/, 9];
                                if (!checkPlintron) return [3 /*break*/, 6];
                                return [4 /*yield*/, ServCel_1.default.procGetAuth(body.msisdn, body.operadora)];
                            case 4:
                                responseGetAuth = _a.sent();
                                dateNow = new Date();
                                transactionID = ('SC' + servCelResponse.idServCel + dateformat_1.default(dateNow, 'yyyymmdhhMMss')).padStart(19, '0');
                                requestTopUp = {
                                    productID: responseGetAuth.plintronProductId,
                                    MSISDN: '55' + body.msisdn,
                                    amount: body.valor.replace(',', ''),
                                    transactionID: transactionID,
                                    terminalID: '02SV',
                                    currency: 'BRL',
                                    cardID: 'Card',
                                    retailerID: 'MGM',
                                    twoPhaseCommit: '0'
                                };
                                return [4 /*yield*/, ServCel_1.default.procTopUp(responseGetAuth.authentication, requestTopUp)];
                            case 5:
                                _a.sent();
                                response.codResposta = '00';
                                return [3 /*break*/, 8];
                            case 6: return [4 /*yield*/, ServCel_1.default.procGetCodResposta(body.msisdn, 'Consulta')];
                            case 7:
                                responseApi = _a.sent();
                                if (responseApi) {
                                    response.codResposta = responseApi.codResposta;
                                }
                                _a.label = 8;
                            case 8: return [3 /*break*/, 10];
                            case 9:
                                console.log('Nuage: FALSE');
                                response.codResposta = '10';
                                _a.label = 10;
                            case 10:
                                req.body.objRes = {
                                    statusCode: statusCode,
                                    response: response
                                };
                                res.format({
                                    'application/xml': function () {
                                        res.status(statusCode).send(buildXml(response.codResposta));
                                    }
                                });
                                return [4 /*yield*/, ServCel_1.default.procInsServCel('Consulta', 210, response.codResposta, checkPlintron, body)];
                            case 11:
                                _a.sent();
                                return [2 /*return*/, next()];
                        }
                    });
                }); })
                    .catch(function (err) {
                    statusCode = 400;
                    console.log(err);
                    req.body.objRes = {
                        statusCode: statusCode,
                        response: response
                    };
                    res.format({
                        'application/xml': function () {
                            res.status(statusCode).send(buildXml(response.codResposta));
                        }
                    });
                    return next();
                });
                return [2 /*return*/];
            });
        });
    };
    ServCelController.store = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var statusCode, response, schema;
            var _this = this;
            return __generator(this, function (_a) {
                statusCode = 200;
                response = {
                    codResposta: '10'
                };
                schema = Yup.object().shape({
                    msisdn: Yup.string().required('MSISDN é obrigatório'),
                    valor: Yup.string().required('Valor é obrigatório'),
                    origem: Yup.string().required('Origem é obrigatório'),
                    dataOrigem: Yup.string().required('Data de origem é obrigatório'),
                    dataServCel: Yup.string().required('Data da transação é obrigatório'),
                    nsuOrigem: Yup.string().required('NSU de origem é obrigatório'),
                    nsuServCel: Yup.string().required('NSU da transação é obrigatório'),
                    produto: Yup.string().required('Produto é obrigatório'),
                    chave: Yup.string().required('Chave é obrigatório'),
                    operadora: Yup.string().required('Operadora é obrigatório')
                });
                schema.validate(req.body.xml)
                    .then(function (body) { return __awaiter(_this, void 0, void 0, function () {
                    var servCelResponse, checkPlintron, responseGetAuth, dateNow, transactionID, requestTopUp, responseTopUp, responseApi;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, ServCel_1.default.procInsServCel('Recarga', 200, '', null, body)];
                            case 1:
                                servCelResponse = _a.sent();
                                return [4 /*yield*/, ServCel_1.default.procCheckPlintron()];
                            case 2:
                                checkPlintron = _a.sent();
                                if (!checkPlintron) return [3 /*break*/, 5];
                                return [4 /*yield*/, ServCel_1.default.procGetAuth(body.msisdn, body.operadora)];
                            case 3:
                                responseGetAuth = _a.sent();
                                dateNow = new Date();
                                transactionID = ('SC' + servCelResponse.idServCel + dateformat_1.default(dateNow, 'yyyymmdhhMMss')).padStart(19, '0');
                                requestTopUp = {
                                    productID: responseGetAuth.plintronProductId,
                                    MSISDN: '55' + body.msisdn,
                                    amount: body.valor.replace(',', ''),
                                    transactionID: transactionID,
                                    terminalID: '02SV',
                                    currency: 'BRL',
                                    cardID: 'Card',
                                    retailerID: 'MGM',
                                    twoPhaseCommit: '1'
                                };
                                return [4 /*yield*/, ServCel_1.default.procTopUp(responseGetAuth.authentication, requestTopUp)];
                            case 4:
                                responseTopUp = _a.sent();
                                if (responseTopUp.code === '00') {
                                    response.codResposta = '00';
                                }
                                else {
                                    response.codResposta = '10';
                                }
                                return [3 /*break*/, 8];
                            case 5:
                                if (!(servCelResponse.code === '01')) return [3 /*break*/, 6];
                                response.codResposta = servCelResponse.code;
                                return [3 /*break*/, 8];
                            case 6: return [4 /*yield*/, ServCel_1.default.procGetCodResposta(body.msisdn, 'Recarga')];
                            case 7:
                                responseApi = _a.sent();
                                if (responseApi) {
                                    response.codResposta = responseApi.codResposta;
                                }
                                _a.label = 8;
                            case 8:
                                req.body.objRes = {
                                    statusCode: statusCode,
                                    response: response
                                };
                                res.format({
                                    'application/xml': function () {
                                        res.status(statusCode).send(buildXml(response.codResposta));
                                    }
                                });
                                return [4 /*yield*/, ServCel_1.default.procInsServCel('Recarga', 210, response.codResposta, checkPlintron, body)];
                            case 9:
                                _a.sent();
                                return [2 /*return*/, next()];
                        }
                    });
                }); })
                    .catch(function (err) {
                    statusCode = 400;
                    console.log(err);
                    req.body.objRes = {
                        statusCode: statusCode,
                        response: response
                    };
                    res.format({
                        'application/xml': function () {
                            res.status(statusCode).send(buildXml(response.codResposta));
                        }
                    });
                    return next();
                });
                return [2 /*return*/];
            });
        });
    };
    return ServCelController;
}());
exports.default = ServCelController;
