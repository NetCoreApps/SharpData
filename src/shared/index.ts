import Vue, {VueConstructor} from 'vue';
import {
    JsonServiceClient,
    normalizeKey,
    toDate, getField, splitOnFirst,
    errorResponse, errorResponseExcept,
    toPascalCase,
    queryString, padInt, appendQueryString,
} from '@servicestack/client';

declare let global: any; // populated from package.json/jest

export const client = new JsonServiceClient('/');

import {desktopInfo, desktopTextFile, evaluateCode, desktopSaveTextFile} from '@servicestack/desktop';

export enum Roles {
  Admin = 'Admin',
}

export interface DesktopInfo {
    tool:string;
    toolVersion:string;
    chromeVersion:string;
}
export interface ColumnSchema {
    columnName: string;
    columnOrdinal: number;
    isUnique: boolean;
    isKey: boolean;
    isAutoIncrement: boolean;
    isRowVersion: boolean;
    isExpression: boolean;
    dataType: string;
    dataTypeName: string;
    allowDBNull: boolean;
    columnDefinition: string;
    numericPrecision: number;
    numericScale: number;
    baseCatalogName: string;
    baseColumnName: string;
    baseSchemaName: string;
    baseTableName: string;
}

// Shared state between all Components
interface State {
    debug: boolean|null;
    desktop: DesktopInfo|null;
    hasExcel: boolean|null;
    tables: {[id:string]:string[]};
    totals: {[id:string]:{[id:string]:number}};
    columns: {[id:string]:{[id:string]:ColumnSchema[]}};
    getColumnTotal(db:string,table:string):number|null;
    getColumnSchemas(db:string,table:string):ColumnSchema[];
}
export const store: State = {
    debug: global.CONFIG.debug as boolean,
    desktop: global.CONFIG.desktop as DesktopInfo,
    hasExcel: global.CONFIG.hasExcel as boolean,
    tables: global.CONFIG.tables as {[id:string]:string[]},
    totals: {},
    columns: {},
    getColumnTotal(db: string, table: string) {
        const ret = this.totals[db] && this.totals[db][table];
        return ret != null ? ret : null;
    },
    getColumnSchemas(db: string, table: string) {
        return this.columns[db] && this.columns[db][table] || [];
    },
};

class EventBus extends Vue {
    store = store;
}
export const bus = new EventBus({ data: store });

export interface DesktopSettings
{
    [db:string]:{[table:string]:TableSettings};
}
export interface TableSettings
{
    skip?:number;
    orderBy?:string;
    filters?:any;
    fields?:string[];
}
let settings:DesktopSettings = {};
let settingsLoaded = false;
export async function loadSettings() {
    try {
        const settingsJson = store.desktop
            ? await desktopTextFile('settings.json')
            : localStorage.getItem('settings.json');
        if (settingsJson) {
            settings = JSON.parse(settingsJson) as DesktopSettings || {};
            log('loaded', settings);
            bus.$emit('settings');
        }
    } catch (e) {
        log(`Could not retrieve desktopTextFile 'settings.json'`, e);
    } finally {
        settingsLoaded = true;
    }
}

export async function saveSettings() {
    try {
        //log('saveSettings', settings, store.desktop);
        const settingsJson = JSON.stringify(settings);
        if (store.desktop) {
            await desktopSaveTextFile('settings.json', settingsJson);
        } else {
            localStorage.setItem('settings.json', settingsJson);
        }
    } catch (e) {
        log(`Could not retrieve saveDesktopTextFile 'settings.json'`, e);
    }
}
export function getTableSettings(db:string,table:string):TableSettings {
    return settings[db] && settings[db][table] || null;
}
export async function saveTableSettings(db:string,table:string,tableSettings:TableSettings|null) {
    if (!settingsLoaded) return;
    if (!settings[db]) {
        settings[db] = {};
    }
    if (tableSettings) {
        settings[db][table] = tableSettings;
    }
    else {
        delete settings[db][table];
    }
    await saveSettings();
}

export function log(...o:any[]) {
    if (store.debug) 
        console.log.apply(console, arguments as any);
    return o;
}

export const dateFmtHMS = (d: Date = new Date()) => 
    `${d.getFullYear()-2000}${padInt(d.getMonth() + 1)}${padInt(d.getDate())}-${padInt(d.getHours())}${padInt(d.getMinutes())}${padInt(d.getSeconds())}`;

export async function openUrl(url:string) {
    if (store.desktop) {
        await evaluateCode(`openUrl('${url}')`);
    } else {
        window.open(url);
    }
}

export async function exec(c:any, fn:() => Promise<any>) {
    try {
        c.loading = true;
        c.responseStatus = null;

        return await fn();

    } catch (e) {
        log(e);
        c.responseStatus = e.responseStatus || (typeof e == 'string' ? { errorCode:'Error', message:e } : null) || e;
        c.$emit('error', c.responseStatus);
    } finally {
        c.loading = false;
    }
}

export async function loadTable(c:any, db:string,table:string) {
    if (store.getColumnSchemas(db, table).length > 0) return;
    await exec(c, async () => {
        const r = await fetch(`/db/${db}/${table}/meta?format=json`);
        const json = await r.text();
        if (json) {
            const obj = JSON.parse(json);
            if (!store.columns[db])
                Vue.set(store.columns, db, {});
            Vue.set(store.columns[db], table, obj);
        }
    })
}

export async function sharpData(db:string,table:string,args?:any)  {
    let url = `/db/${db}/${table}?format=json`;
    if (args) {
        url = appendQueryString(url, args);
    }
    return await (await fetch(url)).json()
}


Vue.filter('upper', function (value:string) {
    return value?.toUpperCase();
});
Vue.filter('json', function (value:any) {
    return value && JSON.stringify(value);
});

(async () => { await loadSettings(); })();

(async () => {
    for (let db in store.tables) {
        try {
            let r = await fetch(`/db/${db}/totals?format=json`);
            let json = await r.text();
            if (json) {
                let kvps = JSON.parse(json);
                let columnTotals:any = {};
                kvps.forEach((x:any) => {
                    columnTotals[x.key] = x.value;
                })
                Vue.set(store.totals, db, columnTotals);
            }
        } catch (e) {
            log(`Can't retrieve totals for '${db}':`, e);
        }
    }
})();

(async () => {
    try {
        store.desktop = await desktopInfo();
        log('In Desktop app:', store.desktop);
    } catch (e) {
        log(`Not in Desktop app:`, e);
    }
})();
