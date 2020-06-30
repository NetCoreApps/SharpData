"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../../../src/shared");
var client_1 = require("@servicestack/client");
shared_1.dbConfig('main', {
    tableName: function (table) { return client_1.humanize(table).split(' ').map(client_1.toPascalCase).join(' '); },
    showTables: 'Customer,Order,OrderDetail,Category,Product,Employee,Shipper,Supplier,Region,Territory'.split(','),
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
    }
});
