import { dbConfig } from "../../../src/shared";
import {humanize, toPascalCase} from "@servicestack/client";

dbConfig('main', {
    tableName: (table:string) => humanize(table).split(' ').map(toPascalCase).join(' '),
    showTables: 'Customer,Order,OrderDetail,Category,Product,Employee,Shipper,Supplier,Region,Territory'.split(','),
    links: {
        Order: {
            CustomerId: (id:string) => `Customer?filter=Id:${id}`,
            EmployeeId: (id:string) => `Employee?filter=Id:${id}`,
            ShipVia: (id:number) => `Shipper?filter=Id:${id}`,
        },
        OrderDetail: {
            OrderId: (id:string) => `Order?filter=Id:${id}`,
            ProductId: (id:string) => `Product?filter=Id:${id}`,
        },
        Product: {
            SupplierId: (id:number) => `Supplier?filter=Id:${id}`,
            CategoryId: (id:number) => `Category?filter=Id:${id}`,
        },
        Territory: {
            RegionId: (id:number) => `Region?filter=Id:${id}`,
        },
    }
});
