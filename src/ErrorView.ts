import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

@Component({ template: 
`<div v-if="responseStatus" class="noplugin-error alert alert-danger mt-3 mr-3">
    <div>{{responseStatus.errorCode}}: {{responseStatus.message}}</div>
    <div v-if="responseStatus.stackTrace">
        <button v-if="!showStackTrace" class="btn btn-link" style="margin-left: -1em" @click="showStackTrace=true">
            <i class="svg-chevron-right svg-lg mb-1" title="expand" />StackTrace</button>
        <div v-if="showStackTrace" class="stacktrace">{{responseStatus.stackTrace}}</div>
    </div>
</div>`
})
export class ErrorView extends Vue {
    @Prop({ default: null }) responseStatus: any;
    showStackTrace = false;
}
export default ErrorView;
Vue.component('error-view', ErrorView);