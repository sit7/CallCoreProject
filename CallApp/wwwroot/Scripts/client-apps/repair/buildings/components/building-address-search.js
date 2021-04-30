Vue.component('building-address-search',
    {
        template: '#building-address-search',
        props: {

            userinfo: { type: Object, required: true },
            searchresult: [],

        },

        methods: {
            viewbuilding: function (building, index) {
                var app = this;
                this.buildinginfo.objectstatus = building.StatusID;
                this.buildinginfo.isverified = building.IsVerified;
                //app.$refs['buildingdialog'].show({
                //    getpayload: {
                //            url: '/repBuilding/GetBuilding',
                //            data: JSON.stringify({ Key: building.BuildingID }),
                //            method: 'post'
                //        }
                //    },
                //    this.confirmdialog);




                $.ajax({
                    url: '/repBuilding/GetBuilding',
                    data: JSON.stringify({ Key: building.BuildingID }),
                    method: 'post',
                    success: (response) => app.$refs['buildingdialog'].show(response.data, (payload) => this.confirmdialog(payload, index))
                });
            },
            allowbuildingedit: function (row) {
                if (row === undefined) return false;
                return this.userinfo.allowedit(row, this.buildinginfo.objectstatus);
            },
            ondialogresult: function (args, scope) {
                console.log(args);
            },
            confirmdialog: function (payload, index) {
                $.ajax({
                    url: '/repBuilding/UpdateBuildingGetShort',
                    dataType: 'json',
                    data: JSON.stringify(payload),
                    method: 'post',
                    success: (response) => this.searchresult[index] = response.data,
                    error: () => console.error('error updating building')
                });
            }
        },
        data: function() {
            return {
                searchresult: [],
                model: buildingModel(),
                buildinginfo: {
                    objectstatus: 0,
                    isverified: false
                },
                
            };
        }
    })