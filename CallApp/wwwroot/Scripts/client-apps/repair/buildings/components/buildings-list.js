Vue.component("buildings-list", {
	template: "#buildings-list",

    data: function () {
        return {
            buildings: [],
            header: '',   
            statusid: -1,
            listmodel: buildingModel(),

        };
    },

    created: function () {
      
    },
    computed: {


    },
    methods: {
        getjson: function(object) {
            return object;
        }
    },
    mounted: function () {
        var vm = this;
        $.ajax({
            url: "/repBuilding/GetBuildingsByObject",
            method: "post",
            dataType: 'json',
            data: JSON.stringify({ Key: +vm.$route.params.objectId }),
            success: function (response) {
                vm.header = response.Header;
                vm.statusid = response.StatusID;
                vm.buildings = response.Details;
            }
        }); 
    }

});