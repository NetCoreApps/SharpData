import {Component, Prop, Vue} from 'vue-property-decorator';
import {ColumnSchema, store} from "../../shared";
import {registerRowComponent} from "./all";
import {getField} from "@servicestack/client";

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
class Customer extends Vue {
    @Prop() public db: string;
    @Prop() public table: string;
    @Prop() row: any;
    @Prop() columns: ColumnSchema[];
    
    customer:any = null;
    orders:any[] = [];

    get id() { return this.row.Id; }
    
    async mounted() {
        this.customer = (await (await fetch(`/db/${this.db}/${this.table}?format=json&Id=${this.id}`)).json())[0];
        const fields = '&fields=Id,EmployeeId,OrderDate,Freight,ShipVia,ShipCity,ShipCountry';
        this.orders = await (await fetch(`/db/${this.db}/Order?format=json&CustomerId=${this.id}${fields}`)).json();
    }
}
registerRowComponent('main','customer', Customer, 'customer');
