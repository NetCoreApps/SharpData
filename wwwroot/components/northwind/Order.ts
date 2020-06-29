import {Component, Prop, Vue} from 'vue-property-decorator';
import {registerRowComponent, RowComponent, sharpData} from "../../../src/shared";

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
registerRowComponent('main','Order', Order, 'order');
