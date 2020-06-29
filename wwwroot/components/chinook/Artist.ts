import {Component, Prop, Vue} from 'vue-property-decorator';
import {registerRowComponent, RowComponent, sharpData} from "../../../src/shared";

@Component({ template: 
`<div v-if="id">
    <h5>Albums</h5>
    <ul>
        <li v-for="x in albums"><a :href="albumHref(x.AlbumId)">{{x.Title}}</a></li>
    </ul>
</div>
<div v-else class="alert alert-danger">Artist Id needs to be selected</div>`
})
class Artist extends RowComponent {

    albums:any[] = [];

    get id() { return this.row.ArtistId; }
    
    albumHref(albumId:string) { return `albums?filter=AlbumId:${albumId}`;}
    
    async mounted() {
        this.albums = await sharpData(this.db,'albums',{ ArtistId: this.id });
    }
}
registerRowComponent('chinook','artists', Artist, 'artist');
