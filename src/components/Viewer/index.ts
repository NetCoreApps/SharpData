import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {
    store,
    client,
    bus,
    exec,
} from '../../shared';

@Component({ template:
    `<section id="home" class="grid-layout">
        <header id="header">
            <h1>
                <nav class="site-breadcrumbs">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item">
                            <router-link to="/"><i class="home-link svg-3x mb-1" title="home" /></router-link>
                        </li>
                        <li v-if="db" class="breadcrumb-item">{{db}}</li>
                        <li v-if="table" class="breadcrumb-item active">{{table}}</li>
                        <li v-if="!db && !table" class="breadcrumb-item">Select Table</li>
                        <li v-if="loading"><i class="svg-loading svg-lg ml-2 mb-1" title="loading..." /></li>
                    </ol>
                </nav>
            </h1>
            <h1 v-else-if="loading">
              <i class="fab fa-loading"></i>
              Loading...
            </h1>
            <div v-else-if="responseStatus">
                <error-summary :responseStatus="responseStatus" />
            </div>
        </header>
        
        <nav id="left">
            <div id="nav-filter">
                <i v-if="txtFilter" class="text-close" style="position:absolute;margin:0 0 0 265px;" title="clear" @click="txtFilter=''"></i>
                <v-input v-model="txtFilter" id="txtFilter" placeholder="filter" inputClass="form-control" />
            </div>
            <div id="sidebar" class="">
                <div>
                    <div v-for="(tables,d) in store.tables" class="ml-1 mt-2">
                        <h4>
                            <i class="svg-db svg-2x"></i>
                            {{d}}
                        </h4>
                        <div v-for="t in filtered(tables)" :key="t" :class="['datamodel',{selected:t==table}]" :title="t">
                            <router-link class="ml-3" :to="link(d,t)">{{t}}</router-link>
                            <span v-if="store.getColumnTotal(d,t) != null" class="text-muted">({{store.getColumnTotal(d,t)}})</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        
        <main v-if="db && table">
            <div v-if="!responseStatus" class="main-container">
                <results :db="db" :table="table" />
            </div>
            <div v-else><error-view :responseStatus="responseStatus" class="mt-5" /></div>
        </main>
        
    </section>`,
})
export class Viewer extends Vue {
    @Prop({ default: '' }) name: string;
    txtFilter = '';

    results:any[] = [];

    loading = false;
    responseStatus = null;

    get store() { return store; }
    get db() { return this.$route.params.db; }
    get table() { return this.$route.params.table; }

    filtered(tables:string[]) {
        return this.txtFilter 
            ? tables.filter(x => x.toLowerCase().indexOf(this.txtFilter.toLowerCase()) >= 0)
            : tables;
    }
    link(d:string,t:string) { return `/${d}/${t}`; }

    async mounted() {
    }

    async submit() {
        await exec(this, async () => {
        });
    }
}
export default Viewer;
Vue.component('viewer', Viewer);

