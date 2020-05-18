import Vue from 'vue';
import {Component, Prop, Watch} from 'vue-property-decorator';
import {
    bus,
    ColumnSchema, dateFmtHMS,
    exec,
    getTableSettings,
    loadTable,
    log,
    openUrl,
    saveTableSettings,
    store,
    TableSettings
} from '../../shared';
import {getField, humanize, normalizeKey, toCamelCase, toDateFmt} from "@servicestack/client";
import {Route} from "vue-router";
import {desktopSaveDownloadUrl, evaluateCode} from "@servicestack/desktop";
import {getRowComponent} from "../Custom/all";

@Component({ template:
    `<a v-if="isUrl" :href="value" target="_blank">{{url}}</a>
     <i v-else-if="lower == 'false'" class="svg svg-md bool-off-muted"></i>
     <i v-else-if="lower == 'true'" class="svg svg-md bool-on-muted"></i>
     <span v-else>{{format}}</span>
`})
class FormatString extends Vue {
    @Prop({ default: '' }) public value: any;

    get lower() { return `${this.value}`.toLowerCase(); }
    get isUrl() { return typeof this.value == "string" && this.value.startsWith('http'); }
    get url() { return typeof this.value == "string" && this.value.substring(this.value.indexOf('://') + 3); }
    get format(){ return typeof this.value == "string" && this.value.startsWith('/Date(') ? toDateFmt(this.value) : this.value; }
}
Vue.component('format', FormatString);

@Component({ template:
`<div>
    <div v-if="!loading" class="main-query">
        <span class="btn svg svg-fields svg-2x" title="View Columns" @click="showSelectColumns=!showSelectColumns"></span>
        <button class="btn first-link svg-2x" :disabled="skip==0" title="<< first" @click="viewNext(-total)"></button>
        <button class="btn left-link svg-2x"  :disabled="skip==0" title="< previous" @click="viewNext(-100)"></button>
        <button class="btn right-link svg-2x" :disabled="results.length < take" title="next >" @click="viewNext(100)"></button>
        <button class="btn last-link svg-2x"  :disabled="results.length < take" title="last >>" @click="viewNext(total)"></button>
        <span class="px-1 results-label">Showing Results {{skip+1}} - {{min(skip + results.length,total)}} <span v-if="total!=null">of {{total}}</span></span>
        <button v-if="dirty" class="btn svg-clear svg-lg" @click="clear()" title="reset query"></button>
        <button v-if="store.hasExcel" class="btn btn-outline-success btn-sm btn-compact" @click="openCsv()" 
            :title="store.hasExcel ? 'Open in Excel' : 'Open CSV'"><i class="svg-md svg-excel"></i>{{store.hasExcel ? 'excel' : 'csv' }}</button>
        <span class="btn btn-sm px-1" @click="open('html')"><i class="svg-md svg-external-link"></i> html</span>
        <span class="btn btn-sm px-0" @click="open('csv')"><i class="svg-md svg-external-link"></i> csv</span>
        <span class="btn btn-sm pl-1" @click="open('json')"><i class="svg-md svg-external-link"></i> json</span>
    </div>
    <div v-else class="loading-query">
        <span class="svg svg-loading svg-2x ml-1"></span>Loading {{ this.columns?.length ? 'results' : 'schema' }}...             
    </div>
    <div v-if="showSelectColumns">
        <select-columns :columns="columns" v-model="fields" @done="handleSelectColumns($event)" />
    </div>
    <table class="results">
        <thead><tr class="noselect">
            <th v-for="f in fieldNames" :key="f" @click="setOrderBy(f)" class="th-link">
                <div class="text-nowrap">
                    {{ humanize(f) }}
                    <span v-if="orderBy==f" class="svg svg-chevron-up svg-md align-top"></span>
                    <span v-else-if="orderBy=='-'+f" class="svg svg-chevron-down svg-md align-top"></span>
                </div>
            </th>
        </tr></thead>
        <tbody>
            <tr class="filters">
                <td v-for="(f,j) in fieldNames">
                    <input type="text" v-model="filters[f]" @keydown.enter.stop="filterSearch()">
                    <span v-if="j==fieldNames.length-1" style="position:absolute;margin-left:-20px;"><i class="svg svg-btn svg-filter svg-md" :title="helpFilters()" /></span>
                </td>
            </tr>
            <template v-for="(r,i) in results">
            <tr :key="i">
                <td v-for="(f,j) in fieldNames" :key="j" :title="renderValue(getField(r,f))">
                    <span v-if="j == 0 && rowComponent" :class="rowComponentClass(i)" @click="toggleRowComponent(i)"></span>
                    <format :value="getField(r,f)" />
                </td>
            </tr>
            <tr v-if="showRowComponent(i)">
                <td :colspan="fieldNames.length">
                    <component :is="rowComponent" :db="db" :table="table" :row="r" :columns="columns"></component>
                </td>                
            </tr>
            </template>
        </tbody>
    </table>
    <error-view :responseStatus="responseStatus" />
</div>`,
})
export class Results extends Vue {
    @Prop() public db: string;
    @Prop() public table: string;

    showSelectColumns = false;
    skip = 0;
    take = 100;
    total:number|null = null;
    orderBy = '';
    filters:{[id:string]:string} = {};
    fields:string[] = [];
    results = [];
    openComponents:number[] = [];

    loading = false;
    responseStatus:any = null;
    
    get store() { return store; }
    get columns() { return store.getColumnSchemas(this.db, this.table); }
    get dirty() { return this.skip || this.orderBy || Object.keys(this.filters).length > 0 || this.fields.length > 0; }
    get rowComponent(){ return getRowComponent(this.db, this.table); }
    get fieldNames() { 
        let ret = this.columns?.map(x => x.columnName);
        if (this.fields.length > 0) {
            ret = ret.filter(x => this.fields.indexOf(x) >= 0);
        }
        return ret;
    }

    showRowComponent(rowIndex:number) { return this.openComponents.indexOf(rowIndex) >= 0; }
    
    toggleRowComponent(rowIndex:number) {
        if (this.showRowComponent(rowIndex))
            this.openComponents = this.openComponents.filter(x => x != rowIndex);
        else
            this.openComponents.push(rowIndex);
    }
    
    rowComponentClass(rowIndex:number) {
        return `svg svg-chevron-${this.showRowComponent(rowIndex) ? 'down' : 'right'} svg-md btn-link align-top`;
    }
    
    min(num1:number,num2:number) { return Math.min(num1, num2); }

    @Watch('$route', { immediate: true, deep: true })
    async onUrlChange(newVal: Route) {
        await this.reset();
    }
    
    async clear() {
        await saveTableSettings(this.db, this.table, null);
        await this.reset();
    }
    
    async reset() {
        const settings = getTableSettings(this.db, this.table) || {};
        this.skip = settings.skip || 0;
        this.orderBy = settings.orderBy || '';
        this.filters = settings.filters || {};
        this.fields = settings.fields || [];

        this.results = [];
        await loadTable(this, this.db, this.table);
        await this.search();
    }

    async handleSelectColumns(e:any) {
        this.showSelectColumns = false;
        await this.search();
    }
    
    async viewNext(skip:number) {
        this.skip += skip;
        if (typeof this.total != 'number') return;
        const lastPage = Math.floor(this.total / 100) * 100;
        if (this.skip > lastPage) {
            this.skip = lastPage;
        }
        if (this.skip < 0) {
            this.skip = 0;
        }
        await this.search();
    } 
    
    get filterQuery() {
        let url = '';
        Object.keys(this.filters).forEach(k => {
            if (this.filters[k]) {
                url += '&'
                url += encodeURIComponent(k) + '=' + encodeURIComponent(this.filters[k]);
            }
        });
        return url;
    }
    
    async filterSearch() {
        this.skip = 0;
        await this.search(); 
    }
    
    createFilteredUrl(format="json") {
        let url = `/db/${this.db}/${this.table}?format=${format}`;
        url += this.filterQuery;
        if (this.fields.length > 0) {
            url += '&fields=' + encodeURIComponent(this.fields.join(','));
        }
        if (this.orderBy) {
            url += '&orderBy=' + encodeURIComponent(this.orderBy);
        }
        return url;
    }
    
    createUrl(format="json") {
        let url = this.createFilteredUrl(format);
        if (this.skip > 0) {
            url += '&skip=' + this.skip;
        }
        if (this.take) {
            url += '&take=' + this.take;
        }
        //log('createUrl, filters', this.filters, 'orderBy', this.orderBy, 'take', this.take, 'URL', url);
        return url;
    }
    
    async search() {
        this.openComponents = [];
        this.results = await exec(this, async () => {
            const url = this.createUrl();
            let r = await fetch(url);
            let json = await r.text();
            return json && JSON.parse(json) || [];
        });
        this.total = await exec(this, async () => {
            let url = `/db/${this.db}/${this.table}/total?format=json`;
            url += this.filterQuery;
            let r = await fetch(url);
            let txtTotal = await r.text();
            return parseInt(txtTotal) || null;
        });
        await saveTableSettings(this.db, this.table, { 
            skip:this.skip,
            filters:this.filters,
            orderBy:this.orderBy,
            fields:this.fields,
        })
    }

    async openCsv() {
        const url = this.createFilteredUrl("csv");
        let downloadUrl = desktopSaveDownloadUrl(`${this.db}-${this.table}-${dateFmtHMS()}.csv`, url) + "?open=true";
        if (store.hasExcel) {
            downloadUrl += '&start=excel';
        }
        await fetch(downloadUrl);
    }
    
    async open(format:string) {
        const url = this.createUrl(format);
        await openUrl(url);
    }

    async mounted() {
        bus.$on('settings', async () => await this.reset());
        await this.reset();
    }

    humanize(s:string) { return humanize(s); }

    renderValue(o: any) {
        return Array.isArray(o)
            ? o.join(', ')
            : typeof o == "undefined"
                ? ""
                : typeof o == "object"
                    ? JSON.stringify(o)
                    : o + "";
    }

    getField(o: any, name: string) { return getField(o,name); }

    async setOrderBy(field:string) {
        if (this.orderBy == field) {
            this.orderBy = '-' + field;
        } else if (this.orderBy == '-' + field) {
            this.orderBy = '';
        } else {
            this.orderBy = field;
        }
        await this.search();
    }

    helpFilters() {
        return `Search Filters:
  Use '=null' or '!=null' to search NULL columns
  Use '<= < > >= <> !=' prefix to search with that operator
  Use ',' suffix to perform an IN(values) search on integers
  Use '%' prefix or suffix to perform a LIKE wildcard search
  Use '=' prefix to perform an exact coerced search
Otherwise a 'string equality' search is performed`
    }
}
export default Results;
Vue.component('results',Results);
