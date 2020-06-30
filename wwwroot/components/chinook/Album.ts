import {Component, Prop, Vue} from 'vue-property-decorator';
import {registerRowComponent, RowComponent, sharpData} from "../../../src/shared";
import {padInt} from '@servicestack/client';

@Component({ template: 
`<div v-if="id">
    <h4>{{row.Title}} <span class="text-muted">by</span> {{artist.Name}}</h4>
    <jsonviewer :value="tracks" />
</div>
<div v-else class="alert alert-danger">Album Id needs to be selected</div>`
})
class Album extends RowComponent {
    
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
registerRowComponent('chinook','albums', Album, 'album');
