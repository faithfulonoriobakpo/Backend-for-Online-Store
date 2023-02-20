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
exports.Order = void 0;
var database_1 = __importDefault(require("../database"));
var Order = /** @class */ (function () {
    function Order() {
    }
    Order.prototype.createOrder = function (order) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, query, createdorder, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        query = "INSERT INTO orders(id,id_of_products,quantity_of_each_product,user_id,status) VALUES($1,$2,$3,$4,$5) RETURNING *";
                        return [4 /*yield*/, conn.query(query, [order.id, order.id_of_products, order.quantity_of_each_product, order.user_id, "active"])];
                    case 2:
                        createdorder = _a.sent();
                        conn.release();
                        return [2 /*return*/, createdorder.rows[0]];
                    case 3:
                        e_1 = _a.sent();
                        throw new Error("Could not create order");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Order.prototype.completeOrder = function (orderId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, checkQuery, result, status_1, query, completedorder, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        checkQuery = "SELECT status FROM orders WHERE id=$1";
                        return [4 /*yield*/, conn.query(checkQuery, [orderId])];
                    case 2:
                        result = _a.sent();
                        status_1 = result.rows[0];
                        if (status_1) {
                            if (status_1 != 'active') {
                                conn.release();
                                throw new Error("order is no longer active!");
                            }
                        }
                        else {
                            conn.release();
                            throw new Error("could not find order");
                        }
                        query = "UPDATE orders SET status='completed' WHERE id=$1 RETURNING *";
                        return [4 /*yield*/, conn.query(query, [orderId])];
                    case 3:
                        completedorder = _a.sent();
                        conn.release();
                        return [2 /*return*/, completedorder.rows[0]];
                    case 4:
                        e_2 = _a.sent();
                        if (e_2 instanceof Error) {
                            throw new Error(e_2.message);
                        }
                        else {
                            throw new Error("Unxpected Error " + e_2);
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Order.prototype.cancelOrder = function (orderId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, checkQuery, result, status_2, query, canceledorder, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        checkQuery = "SELECT status FROM orders WHERE id=$1";
                        return [4 /*yield*/, conn.query(checkQuery, [orderId])];
                    case 2:
                        result = _a.sent();
                        status_2 = result.rows[0];
                        if (status_2) {
                            if (status_2 != 'active') {
                                conn.release();
                                throw new Error("order is no longer active!");
                            }
                        }
                        else {
                            conn.release();
                            throw new Error("could not find order");
                        }
                        query = "UPDATE orders SET status='canceled' WHERE id=$1 AND status='active' RETURNING *";
                        return [4 /*yield*/, conn.query(query, [orderId])];
                    case 3:
                        canceledorder = _a.sent();
                        conn.release();
                        return [2 /*return*/, canceledorder.rows[0]];
                    case 4:
                        e_3 = _a.sent();
                        if (e_3 instanceof Error) {
                            throw new Error(e_3.message);
                        }
                        else {
                            throw new Error("Unxpected Error " + e_3);
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Order.prototype.currentOrders = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, query, currentorders, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        query = "SELECT * FROM orders WHERE user_id=$1 AND status=active";
                        return [4 /*yield*/, conn.query(query, [userId])];
                    case 2:
                        currentorders = _a.sent();
                        conn.release();
                        return [2 /*return*/, currentorders.rows];
                    case 3:
                        e_4 = _a.sent();
                        throw new Error("Could not get current orders for user");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Order.prototype.completedOrders = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, query, completedorders, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        query = "SELECT * FROM orders WHERE user_id=$1 AND status=completed";
                        return [4 /*yield*/, conn.query(query, [userId])];
                    case 2:
                        completedorders = _a.sent();
                        conn.release();
                        return [2 /*return*/, completedorders.rows];
                    case 3:
                        e_5 = _a.sent();
                        throw new Error("Could not get completed orders for user");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Order.prototype.canceledOrders = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, query, canceledorders, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        query = "SELECT * FROM orders WHERE user_id=$1 AND status=canceled";
                        return [4 /*yield*/, conn.query(query, [userId])];
                    case 2:
                        canceledorders = _a.sent();
                        conn.release();
                        return [2 /*return*/, canceledorders.rows];
                    case 3:
                        e_6 = _a.sent();
                        throw new Error("Could not get canceled orders for user");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Order;
}());
exports.Order = Order;
