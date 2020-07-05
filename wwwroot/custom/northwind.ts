import { dbConfig, RowComponent, sharpData, splitPascalCase } from "../../src/shared";
import { Component } from "vue-property-decorator";

@Component({ template:
`<div v-if="id" class="pl-2">
    <h3 class="text-success">{{customer.ContactName}}</h3>
    <table class="table table-bordered" style="width:auto">
        <tr>
            <th>Contact</th>
            <td>{{ customer.ContactName }} ({{ customer.ContactTitle }})</td>
        </tr>
        <tr>
            <th>Address</th>
            <td>
                <div>{{ customer.Address }}</div>
                <div>{{ customer.City }}, {{ customer.PostalCode }}, {{ customer.Country }}</div>
            </td>
        </tr>
        <tr>
            <th>Phone</th>
            <td>{{ customer.Phone }}</td>
        </tr>
        <tr v-if="customer.Fax">
            <th>Fax</th>
            <td>{{ customer.Fax }}</td>
        </tr>
    </table>
    <jsonviewer :value="orders" />
</div>
<div v-else class="alert alert-danger">Customer Id needs to be selected</div>`
})
class Customer extends RowComponent {

    customer:any = null;
    orders:any[] = [];

    get id() { return this.row.Id; }

    async mounted() {
        this.customer = (await sharpData(this.db,this.table,{ Id: this.id }))[0];
        const fields = 'Id,EmployeeId,OrderDate,Freight,ShipVia,ShipCity,ShipCountry';
        this.orders = await sharpData(this.db,'Order',{ CustomerId: this.id, fields })
    }
}

@Component({ template:
`<div v-if="id">
    <jsonviewer :value="details" />
</div>
<div v-else class="alert alert-danger">Order Id needs to be selected</div>`
})
class Order extends RowComponent {
    details:any[] = [];

    get id() { return this.row.Id; }

    async mounted() {
        this.details = await sharpData(this.db,'OrderDetail',{ OrderId: this.id });
    }
}

dbConfig('northwind', {
    showTables: 'Customer,Order,OrderDetail,Category,Product,Employee,Shipper,Supplier,Region,Territory'.split(','),
    tableName: splitPascalCase,
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
    },
    rowComponents: {
        Order,
        Customer,
    }
});
