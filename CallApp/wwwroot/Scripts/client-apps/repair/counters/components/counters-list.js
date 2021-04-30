Vue.component('counters-list',
    {
        template: '#counters-list',
        data: function() {
            return {}
        },
        props: {
            model: { required: true, type: Object },
            userinfo: { required: true, type: Object }
        },
        computed: {
            payload: function() {
                return {
                    CounterTypeID: null,
                    VerifyWithin: null,
                    ObjectID: this.userinfo.idobject,
                    BuildingID: null
                }
            },
            credentials: function() {
                return this.model.createcredentials(this.userinfo);
            }
        },
        methods: {
            createnewcounter: function() {
                return this.model.createnew(this.userinfo);

            },
            onaddnew: function (row, confirm) {
                this.$refs['countereditor'].show(row, confirm);
            },

            //ondialogresult: function (row, scope) {
            //    this.$refs['countersgrid'].ondialogresult(row, scope);
            //},
            getloadargs: function() {
                return this.payload;
            }
        }
    })