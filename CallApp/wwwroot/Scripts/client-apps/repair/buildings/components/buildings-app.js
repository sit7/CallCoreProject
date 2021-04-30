Vue.component("buildings-app",
	{
		template: "#buildings-app",
        mixins: [jsonmixins],
        data: function () {
            var vm = this;
            return {
                model: buildingModel(),
                searchString: '',
                addressearch: '',
                searchResult: [],
                buildingresult: [],
                objects: [],

			}
		},
        methods: {

			countObjectCardContainerSpan: function (index) {
				var vm = this;
				
				if (index === vm.objects.length - 1) {

                    return (3 - (vm.objects.length- 1) % 3) * 8;
				}
				return 8;
			},
			findObject: function(value) {
				var store = this.$store;
				var vm = this;
				vm.searchResult = this.objects.filter(function(object) {
					return object.UltraShortName.toLowerCase().search(value.toLowerCase()) !== -1;
				});
            },
            onsuccessaddresssearch: function(response) {
                this.buildingresult = response.data;
            },

            //allowbuildingedit: function(building) {
            //    return this.credentials
            //}
		},
        mounted: function () {
            var vm = this;
            $.ajax({
                url: '/repBuilding/GetObjectBuildingGroups',
                method: 'get',
                dataType: 'json',
                success: function (response) {
                    vm.objects = response;
                }
            });
		},
        created: function () {
            
        },
		computed: {
			isSearchStarted: function () {
				return this.searchString.length >= 2;
			},
            isAddressSearchStarted: function() {
                return this.addressearch.length >= 2;
            }
			//objectGroups: function () {

   //             return this.objects;
			//},
			//ObjectsCount: function () {
   //             return this.objects.length;
			//}

		},

		watch: {
			"searchString": function (value) {
				var vm = this;
				if (this.isSearchStarted) {
					clearTimeout(vm.findObject);
					setTimeout(vm.findObject, 300, value);
				}
            },
            "addressearch": function(value) {
                if (this.isAddressSearchStarted) {
                    $.ajax({
                        url: '/repBuilding/FindByAddress',
                        method: 'post',
                        dataType: 'json',
                        data: JSON.stringify({ SearchString: value}),
                        success: this.onsuccessaddresssearch
                    });
                }
            }
		}
	});