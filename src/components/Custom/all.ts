import Vue, {VueConstructor} from 'vue';

const rowComponents:{[id:string]:{[id:string]:string}} = {};
export function getRowComponent(db:string, table:string) {
    db = db.toLowerCase();
    table = table.toLowerCase();
    return rowComponents[db] && rowComponents[db][table] || null;
}
export function registerRowComponent<VC extends VueConstructor>(db:string, table:string, constructor:VC, component:string) {
    Vue.component(component, constructor);
    db = db.toLowerCase();
    table = table.toLowerCase();
    if (!rowComponents[db])
        rowComponents[db] = {};
    rowComponents[db][table] = component;
}
