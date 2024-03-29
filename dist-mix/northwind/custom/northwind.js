"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../../src/shared");
var vue_property_decorator_1 = require("vue-property-decorator");
var Customer = /** @class */ (function (_super) {
    __extends(Customer, _super);
    function Customer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.customer = null;
        _this.orders = [];
        return _this;
    }
    Object.defineProperty(Customer.prototype, "id", {
        get: function () { return this.row.Id; },
        enumerable: true,
        configurable: true
    });
    Customer.prototype.mounted = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, fields, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, shared_1.sharpData(this.db, this.table, { Id: this.id })];
                    case 1:
                        _a.customer = (_c.sent())[0];
                        fields = 'Id,EmployeeId,OrderDate,Freight,ShipVia,ShipCity,ShipCountry';
                        _b = this;
                        return [4 /*yield*/, shared_1.sharpData(this.db, 'Order', { CustomerId: this.id, fields: fields })];
                    case 2:
                        _b.orders = _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Customer = __decorate([
        vue_property_decorator_1.Component({ template: "<div v-if=\"id\" class=\"pl-2\">\n    <h3 class=\"text-success\">{{customer.ContactName}}</h3>\n    <table class=\"table table-bordered\" style=\"width:auto\">\n        <tr>\n            <th>Contact</th>\n            <td>{{ customer.ContactName }} ({{ customer.ContactTitle }})</td>\n        </tr>\n        <tr>\n            <th>Address</th>\n            <td>\n                <div>{{ customer.Address }}</div>\n                <div>{{ customer.City }}, {{ customer.PostalCode }}, {{ customer.Country }}</div>\n            </td>\n        </tr>\n        <tr>\n            <th>Phone</th>\n            <td>{{ customer.Phone }}</td>\n        </tr>\n        <tr v-if=\"customer.Fax\">\n            <th>Fax</th>\n            <td>{{ customer.Fax }}</td>\n        </tr>\n    </table>\n    <jsonviewer :value=\"orders\" />\n</div>\n<div v-else class=\"alert alert-danger\">Customer Id needs to be selected</div>"
        })
    ], Customer);
    return Customer;
}(shared_1.RowComponent));
var Order = /** @class */ (function (_super) {
    __extends(Order, _super);
    function Order() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.details = [];
        return _this;
    }
    Object.defineProperty(Order.prototype, "id", {
        get: function () { return this.row.Id; },
        enumerable: true,
        configurable: true
    });
    Order.prototype.mounted = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, shared_1.sharpData(this.db, 'OrderDetail', { OrderId: this.id })];
                    case 1:
                        _a.details = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Order = __decorate([
        vue_property_decorator_1.Component({ template: "<div v-if=\"id\">\n    <jsonviewer :value=\"details\" />\n</div>\n<div v-else class=\"alert alert-danger\">Order Id needs to be selected</div>"
        })
    ], Order);
    return Order;
}(shared_1.RowComponent));
shared_1.dbConfig('northwind', {
    showTables: 'Customer,Order,OrderDetail,Category,Product,Employee,Shipper,Supplier,Region,Territory'.split(','),
    tableName: shared_1.splitPascalCase,
    links: {
        Order: {
            CustomerId: function (id) { return "Customer?filter=Id:" + id; },
            EmployeeId: function (id) { return "Employee?filter=Id:" + id; },
            ShipVia: function (id) { return "Shipper?filter=Id:" + id; },
        },
        OrderDetail: {
            OrderId: function (id) { return "Order?filter=Id:" + id; },
            ProductId: function (id) { return "Product?filter=Id:" + id; },
        },
        Product: {
            SupplierId: function (id) { return "Supplier?filter=Id:" + id; },
            CategoryId: function (id) { return "Category?filter=Id:" + id; },
        },
        Territory: {
            RegionId: function (id) { return "Region?filter=Id:" + id; },
        },
    },
    rowComponents: {
        Order: Order,
        Customer: Customer,
    }
});
