import {Component, Prop, Vue} from 'vue-property-decorator';
import {ColumnSchema, sharpData, store} from "../../shared";
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
        this.details = await sharpData(this.db,'OrderDetail',{ OrderId: this.id });
    }
}
registerRowComponent('main','Order', Order, 'order');

