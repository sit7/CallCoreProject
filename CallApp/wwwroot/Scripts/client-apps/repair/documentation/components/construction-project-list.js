Vue.component('construction-project-list',
    {
        template: '#construction-project-list',
        data: function () {
            
            
            return {
                projectcreds: this.projectmodel.createcredentials(this.userinfo),
                albcreds: this.albumodel.createcredentials(this.userinfo),
                projectpayload: { Key: this.userinfo.objectid }
            };
        },
        computed: {
            
        },
        props: {
            userinfo: { type: Object, required: true },
            projectmodel: { type: Object, required: true, default: () => projectmodel() },
            albumodel: { type: Object, required: true, default: () => projectalbummodel() },
            contentsmodel: { type: Object, required: true, default: () => albumcontent() }
        },
        methods: {
            createnew: function () {
                return this.projectmodel.createnew(this.userinfo);
            },
            getuserinfo: function(value) {
                return value;
            },
            ondialogaddnew: function(row, confirm) {
                this.$refs['albummodelform'].show(row, confirm);
            },
            getprojectparams: function(scope) {
                return { Key: scope.row.ProjectID };
            },
            onaddnew: function (row, confirm) {
                this.$refs['projectform'].show(row, confirm);
            },
            newproject: function() {
                return this.projectmodel.createnew();
            },
            //ondialogresult: function (row, scope) {
            //    this.$refs['projectgrid'].ondialogresult(row, scope);
            //},
            onalbumdialogresult: function (row, scope) {
                this.albumodel.save(row, scope);
            },
            alloweditalbum: function(row) {
                return true;
            },
            alloweditproject: function(row) {
                return true;
            },

        },
        mounted: function() {
            
        }
    })