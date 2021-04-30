Vue.component("rep-request-app", {
	
	template: "#rep-request-app",
	mixins: [jsonmixins],
    data: function () {
        var vm = this;
        
        return {
            requests :requests(),
            officerequestmodel: officerequestmodel(),

        };
    },
    props: {
        
    },
    
	created: function () {
	    
	},

    mounted: function () {
        
	},
	methods: {

        countObjectCardContainerSpan: function (index) {
            var vm = this;

            if (index === vm.objectGroups.length - 1) {

                return (3 - (vm.objectGroups.length - 1) % 3) * 8;
            }
            return 8;
        },
        getjson: function (obj) {
            return obj;
        }
	}
})