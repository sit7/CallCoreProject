Vue.component('building-summary',
    {
        template: '#building-summary',
        data: function() {
            return {
                summary: Object,
                filter: {
                    StatusID: 0,
                    IsVerified: null
                }
            };
        },

        computed: {
            all: function () {
                this.filter.StatusID = 0;
                return this.filter;
            },
            notviewed: function() {
                this.filter.StatusID = 1;
                return this.filter;
            },
            ready: function() {
                this.filter.StatusID = 2;
                return this.filter;
            },
            returned: function() {
                this.filter.StatusID = 3;
                return this.filter;
            }
        },
        methods: {
            onbuttonclick: function(args) {
                console.log(args);
            }
        },

        mounted: function() {
            $.ajax({
                url: '/repBuilding/GetBuildingsSummary',
                method: 'get',
                success: (response) => this.summary = response.summary
            });
        }
    })