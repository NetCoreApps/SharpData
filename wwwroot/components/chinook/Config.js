"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../../../src/shared");
var client_1 = require("@servicestack/client");
shared_1.dbConfig('chinook', {
    tableName: function (table) { return client_1.humanize(table).split(' ').map(client_1.toPascalCase).join(' '); },
    showTables: 'albums,artists,playlists,tracks,genres,media_types,customers,employees,invoices'.split(','),
    links: {
        albums: {
            ArtistId: function (id) { return "artists?filter=ArtistId:" + id; }
        },
        employees: {
            ReportsTo: function (id) { return "employees?filter=EmployeeId:" + id; }
        },
        invoices: {
            CustomerId: function (id) { return "customers?filter=CustomerId:" + id; }
        },
        tracks: {
            TrackId: function (id) { return "albums?filter=AlbumId:" + id; },
            MediaTypeId: function (id) { return "media_types?filter=MediaTypeId:" + id; },
            GenreId: function (id) { return "genres?filter=GenreId:" + id; },
        }
    }
});
