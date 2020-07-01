import { dbConfig, RowComponent, sharpData, splitPascalCase } from "../../src/shared";
import { Component } from "vue-property-decorator";
import { padInt } from "@servicestack/client";

@Component({ template:
`<div v-if="id">
    <h5>Albums</h5>
    <ul>
        <li v-for="x in albums"><a :href="albumHref(x.AlbumId)">{{x.Title}}</a></li>
    </ul>
</div>
<div v-else class="alert alert-danger">Artist Id needs to be selected</div>`
})
export class Artist extends RowComponent {

    albums:any[] = [];

    get id() { return this.row.ArtistId; }

    albumHref(albumId:string) { return `albums?filter=AlbumId:${albumId}`;}

    async mounted() {
        this.albums = await sharpData(this.db,'albums',{ ArtistId: this.id });
    }
}

@Component({ template:
`<div v-if="id">
    <h4>{{row.Title}} <span class="text-muted">by</span> {{artist.Name}}</h4>
    <jsonviewer :value="tracks" />
</div>
<div v-else class="alert alert-danger">Album Id needs to be selected</div>`
})
export class Album extends RowComponent {

    artist:any = null;
    tracks:any[] = [];

    get id() { return this.row.AlbumId; }

    async mounted() {
        this.artist = (await sharpData(this.db,'artists',{ ArtistId: this.row.ArtistId }))[0];
        const secsToTime = (s:number) => `${Math.floor(s / 60)}:${padInt(Math.round(s % 60))}`;
        const genres:any = {};
        (await sharpData(this.db,'genres')).forEach((x:any) => genres[x.GenreId] = x.Name);
        const media:any = {};
        (await sharpData(this.db,'media_types')).forEach((x:any) => media[x.MediaTypeId] = x.Name);
        this.tracks = (await sharpData(this.db,'tracks',{ AlbumId: this.id })).map((x:any) => ({
            Name: x.Name,
            Genre: genres[x.GenreId],
            Duration: secsToTime(x.Milliseconds / 1000),
            Price: `$${x.UnitPrice}`,
            Size: Math.floor(x.Bytes / 1024) + " kB",
            Media: media[x.MediaTypeId],
        }));
    }
}

@Component({ template:
`<div v-if="id">
    <div v-if="tracks.length">
        <h5>Tracks</h5>
        <ul>
            <li v-for="x in tracks"><a :href="trackHref(x.TrackId)">{{x.Name}}</a></li>
        </ul>
    </div>
    <div v-else>playlist has no tracks</div>
</div>
<div v-else class="alert alert-danger">Playlist Id needs to be selected</div>`
})
export class Playlist extends RowComponent {

    tracks:any[] = [];

    get id() { return this.row.PlaylistId; }

    trackHref(trackId:string) { return `tracks?filter=TrackId:${trackId}`;}

    async mounted() {
        const trackIds = (await sharpData(this.db,'playlist_track',{ PlaylistId: this.id, take:200 })).map((x:any) => x.TrackId);
        this.tracks = await sharpData(this.db,'tracks',{ TrackId: trackIds.join(',') + ',' });
    }
}

dbConfig('chinook', {
    showTables: 'albums,artists,playlists,tracks,genres,media_types,customers,employees,invoices'.split(','),
    tableName: splitPascalCase,
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
            AlbumId: (id:number) => `albums?filter=AlbumId:${id}`,
            MediaTypeId: (id:number) => `media_types?filter=MediaTypeId:${id}`,
            GenreId: (id:number) => `genres?filter=GenreId:${id}`,
        }
    },
    rowComponents: {
        albums: Album,
        artists: Artist,
        playlists: Playlist,
    }
});
