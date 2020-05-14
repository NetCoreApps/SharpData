import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { bus, store } from './shared';

@Component({ template: 
    `<div>
        <router-view></router-view>
    </div>`
})
export class App extends Vue {
    get store() { return store; }
}
export default App;
