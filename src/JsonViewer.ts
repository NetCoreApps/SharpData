import { Component, Prop, Vue } from 'vue-property-decorator';
import {humanize, toDate, toPascalCase} from "@servicestack/client";

const show = (k:any) => typeof k !== "string" || k.substr(0, 2) !== "__";
const keyFmt = (t:string) => humanize(toPascalCase(t));
const uniqueKeys = (m: any[]): any => {
    var h:any = {};
    for (var i = 0, len = m.length; i < len; i++) {
        const values:any = m[i];
        for (let k in values) {
            if (values.hasOwnProperty(k) && show(k)) {
                h[k] = k;
            }
        }
    }
    return h;
};

var valueFmt = (k:string, v:any, vFmt:string) => vFmt;

const num = (m:number) => m;
const date = (s:string) => toDate(s);
const pad = (d:number) => d < 10 ? '0' + d : d;
const dmft = (d:Date) => d.getFullYear() + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getDate());
var str = (m:string) => m.substr(0, 6) === '/Date(' ? dmft(date(m)) : m;

const obj = (m:any):string => {
    return (`<dl>
            ${Object.keys(m).filter(show).map(k => (
                `<dt class="ib">${keyFmt(k)}</dt><dd>${valueFmt(k, m[k], val(m[k]))}</dd>`
            )).join('')}
        </dl>`);
};

const arr = (m: any[]):string => {
    if (typeof m[0] == 'string' || typeof m[0] == 'number')
        return `<span>${m.join(', ')}</span>`;

    var h = uniqueKeys(m);
    return (`
        <table>
        <thead>
            <tr>
                ${Object.keys(h).map(k => (`<th><b></b>${keyFmt(k)}</th>`)).join('')}
            </tr>
        </thead>
        <tbody>
        ${m.map(row => (
            `<tr>
                ${Object.keys(h).filter(show).map(k => `<td>${valueFmt(k, row[k], val(row[k]) )}</td>`).join('')}
            </tr>`)).join('')}
        </tbody>
    </table>`);
};

const val = (m: any, valueFn?: (k: string, v: any, vFmt: string) => string):string => {
    if (valueFn)
        valueFmt = valueFn;
    if (m == null) return "";
    if (typeof m == "number") return `${num(m)}`;
    if (typeof m == "string") return str(m);
    if (typeof m == "boolean") return m ? "true" : "false";
    return m.length ? arr(m) : obj(m);
};

@Component({ template: 
    `<div class="jsonviewer">
        <div v-html="html"></div>
        <span class="clearfix"></span>
    </div>`
})
export class JsonViewer extends Vue {
    @Prop({ default: null }) value: any;
    @Prop({ default: null }) json: string;
    
    get html() { return this.json ? val(JSON.parse(this.json)) : val(this.value); }
}
export default JsonViewer;
Vue.component('jsonviewer',JsonViewer);