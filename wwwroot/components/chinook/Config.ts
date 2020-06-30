import { dbConfig } from "../../../src/shared";
import {humanize, toPascalCase} from "@servicestack/client";

dbConfig('chinook', {
    tableName: (table:string) => humanize(table).split(' ').map(toPascalCase).join(' '),
    showTables: 'albums,artists,playlists,tracks,genres,media_types,customers,employees,invoices'.split(','),
    links: {
        albums: {
            ArtistId: (id:number) => `artists?filter=ArtistId:${id}`
        },
        employees: {
            ReportsTo: (id:number) => `employees?filter=EmployeeId:${id}`
        },
        invoices: {
            CustomerId: (id:number) => `customers?filter=CustomerId:${id}`
        },
        tracks: {
            TrackId: (id:number) => `albums?filter=AlbumId:${id}`,
            MediaTypeId: (id:number) => `media_types?filter=MediaTypeId:${id}`,
            GenreId: (id:number) => `genres?filter=GenreId:${id}`,
        }
    }
});
