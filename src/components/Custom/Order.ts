import {Component, Prop, Vue} from 'vue-property-decorator';
import {ColumnSchema, store} from "../../shared";
import {registerRowComponent} from "./all";
import {getField} from "@servicestack/client";

@Component({ template: 
`<div v-if="id">
    <jsonviewer :value="details" />
</div>
<div v-else class="alert alert-danger">Order Id needs to be selected</div>`
})
class Order extends Vue {
    @Prop() public db: string;
    @Prop() public table: string;
    @Prop() row: any;
    @Prop() columns: ColumnSchema[];
    
    details:any[] = [];
    
    get id() { return this.row.Id; }
    
    async mounted() {
        this.details = await (await fetch(`/db/${this.db}/OrderDetail?format=json&OrderId=${this.id}`)).json();
    }
}
registerRowComponent('main','Order', Order, 'order');

