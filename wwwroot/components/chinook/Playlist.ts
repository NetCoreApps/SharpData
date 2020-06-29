import {Component, Prop, Vue} from 'vue-property-decorator';
import {registerRowComponent, RowComponent, sharpData} from "../../../src/shared";

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
class Playlist extends RowComponent {

    tracks:any[] = [];

    get id() { return this.row.PlaylistId; }
    
    trackHref(trackId:string) { return `tracks?filter=TrackId:${trackId}`;}
    
    async mounted() {
        const trackIds = (await sharpData(this.db,'playlist_track',{ PlaylistId: this.id, take:200 })).map((x:any) => x.TrackId);
        this.tracks = await sharpData(this.db,'tracks',{ TrackId: trackIds.join(',') + ',' });
    }
}
registerRowComponent('chinook','playlists', Playlist, 'playlist');
