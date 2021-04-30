Vue.component("rep-request-file-grid", {
    template: "#rep-request-file-grid",
    data: function () {
        return {
            args: this.loadargs,
            filemodel: requestfilemodel(),
            getfilescompleted: false,
            //filecredentials: null
        }
    },
    computed: {
        filecredentials: function() {
            return this.filemodel.createcredentials(this.userinfo);
        }
    },

    props: {
        loadargs: { type: Object, required: true },
        userinfo: { type: Object, required: true },
        request: { type: Object, required: true }
    },

    mounted: function () {
        
    },
    methods: {
        allownew: function() {
            return this.request.RegDate === null && this.userinfo.isrepair || this.userinfo.isadmin;
        },
        allowdelete: function() {
            return this.request.RegDate === null && this.userinfo.isrepair || this.userinfo.isadmin;
        },
        allowedit: function() {
            return this.request.RegDate === null && this.userinfo.isrepair || this.userinfo.isadmin;
        },
    }
})