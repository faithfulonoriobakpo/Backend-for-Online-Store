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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var Products_1 = __importDefault(require("../../models/Products"));
var productRoute = express_1["default"].Router();
productRoute.get('/index/:productName', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productName, product_instance, index, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                productName = req.params.productName;
                product_instance = new Products_1["default"]();
                return [4 /*yield*/, product_instance.index(productName)];
            case 1:
                index = _a.sent();
                res.status(index.status).json(index);
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                res.status(500).json({
                    status: 500,
                    message: "Something went wrong internally"
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
productRoute.get('/show/:index', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var index, product_instance, product, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                index = Number(req.params.index);
                if (isNaN(index))
                    throw new TypeError("index must be a number");
                product_instance = new Products_1["default"]();
                return [4 /*yield*/, product_instance.show(index)];
            case 1:
                product = _a.sent();
                res.status(product.status).json(product);
                return [3 /*break*/, 3];
            case 2:
                e_2 = _a.sent();
                if (e_2 instanceof TypeError) {
                    res.status(400).json({
                        status: 400,
                        message: e_2.message
                    });
                }
                else {
                    res.status(500).json({
                        status: 500,
                        message: "Something went wrong internally"
                    });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
productRoute.post('/create', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, product_instance, response, e_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                if (!(req.body.name && req.body.price && req.body.category)) return [3 /*break*/, 2];
                product = {
                    name: req.body.name,
                    price: Number(req.body.price),
                    category: req.body.category
                };
                if (isNaN(product.price))
                    throw new TypeError("Price must be a number");
                product_instance = new Products_1["default"]();
                return [4 /*yield*/, product_instance.create(product)];
            case 1:
                response = _b.sent();
                res.status(response.status).json(response);
                return [3 /*break*/, 3];
            case 2:
                res.status(400).json({
                    status: 400,
                    message: "name, price and category cannot be empty"
                });
                _b.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                e_3 = _b.sent();
                if (e_3 instanceof TypeError) {
                    res.status(400).json({
                        status: 400,
                        message: e_3.message
                    });
                }
                else if (e_3 instanceof Error) {
                    res.json({
                        status: 500,
                        message: (_a = e_3.message) !== null && _a !== void 0 ? _a : "Something went wrong internally"
                    });
                }
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
productRoute.get('/products/category', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var category, product_instance, result, e_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                category = req.query.category;
                product_instance = new Products_1["default"]();
                return [4 /*yield*/, product_instance.show_products_by_category(category)];
            case 1:
                result = _b.sent();
                res.status(result.status).json(result);
                return [3 /*break*/, 3];
            case 2:
                e_4 = _b.sent();
                if (e_4 instanceof Error) {
                    res.json({
                        status: 500,
                        message: (_a = e_4.message) !== null && _a !== void 0 ? _a : "Something went wrong internally"
                    });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports["default"] = productRoute;
