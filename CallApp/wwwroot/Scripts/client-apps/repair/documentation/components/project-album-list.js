Vue.component('project-album-list',
    {
        template: '#project-album-list',
        data: function () {
            var albumodel = projectalbummodel();
            return {
                model: albumodel,
                creds: albumodel.createcredentials(this.userinfo)
            };
        },
        props: {
            userinfo: {
                type: Object, required: true, default: function () {
                    return {
                        isadmin: false
                    };
                }
            },
        },
        methods: {
            onaddnew: function (row, confirm) {
                this.$refs['albumeditor'].show(row, confirm);
            },
            newproject: function () {
                return this.model.createnew();
            },
            //ondialogresult: function (row, scope) {
            //    this.$refs['albumgrid'].ondialogresult(row, scope);
            //},
            getloadargs: function(row) {
                console.log(row);
                return { Key: row.ObjectID };
            }
        },
    })