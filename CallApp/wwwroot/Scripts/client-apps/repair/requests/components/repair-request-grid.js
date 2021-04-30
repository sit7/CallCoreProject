Vue.component("repair-request-grid", {
	template: "#repair-request-grid",
    data: function () {
        var vm = this;
        return {
            registerobject: null,
            officecredentials: this.officemodel.createcredentials(this.creds),
            requestcredentials: this.requestmodel.createcredentials(this.creds),
            requestfilter: this.filtermodel.new(this.creds),
            commentcredentials: this.requestcomment.createcredentials(this.creds),
        };
    },
	computed: {

	},
    props: {
        requestmodel: { type: Object, required: true },
        officemodel: { type: Object, required: true },
        requestcomment: { type: Object, default: function() {
            return requestcomment();
        }},
        creds: { type: Object, required: true },
        filtermodel: {
            type: Object, default: function() {
                return RequestArgModel();
            }}
	},
    mounted: function() {
        
    },
    methods: {

        onaddnew: function (row, confirm) {
            this.$refs['requesteditor'].show(row, confirm);
        },

        allowrequestedit: function(request) {
            return this.requestcredentials.allowedit(request);
        },
        allowofficeedit: function(office) {
            return this.officecredentials.allowedit(office);
        },
  
        newrequest: function() {
            return this.requestmodel.new(this.creds.objectid);
        }

	}
})