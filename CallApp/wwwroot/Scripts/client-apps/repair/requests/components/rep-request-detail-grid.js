Vue.component("rep-request-detail-grid", {

    template: "#rep-request-detail-grid",

    data: function () {
        var vm = this;
        var model = requestdetailmodel();
        return {
            detailcredentials: model.createcredentials(this.userinfo),
            detailmodel: model,
            detailpayload: { Key: this.request.RequestID },
            commentcredentials: this.detailcomment.createcredentials(this.userinfo),
    }
    },
    computed: {
        allowadd: function () {
            return this.detailcredentials.allownew(this.request);
        },
    },
    created: function () {
        
    },
    mounted: function () {
        
    },

    props: {
        userinfo: { type: Object, required: true },
        request: { type: Object, required: true },
        detailcomment: { type: Object, default: () => requestdetailcomment()}
    },

    methods: {
 
        touchdetail: function(userinfo, method, row) {
            return this.request.RegDate == null && this.detailcredentials.touch(userinfo, method, row);
        },
        newdetail: function() {
            return this.detailmodel.new(this.request.RequestID);
        },
        //ondialogresult: function(row, scope) {
        //    this.$refs['detailgrid'].ondialogresult(row, scope);
        //},
        onaddnew: function (row, confirm) {
            this.$refs['detaileditor'].show(row, confirm);
        },
        allowedit: function(row) {
            return this.request.RegDate == null && this.detailcredentials.allowedit(row);
        }
    }
})