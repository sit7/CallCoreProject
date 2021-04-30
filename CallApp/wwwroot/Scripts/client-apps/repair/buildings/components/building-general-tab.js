Vue.component("building-general-tab", {
	template: "#building-general-tab",
	mixins: [crossdMixins],
	data: function () {
		return {
			model: {
				BuildingTypeID: Number,
				Name: String,
				Address :String,
				Description:String,
				BuildYear:Number,
				FloorNum:Number,
				OperationalManagementCertificate:String
			}, 
			loading: false
		}
	},

	watch: {
		// call again the method if the route changes
		'$route': 'fetchData'
	},

	methods: {
		fetchData: function () {
			this.loading = true;
			var key = this.$route.params.buildingid;
			if (key === undefined) this.model = this.$store.getters.generalInfoDefault;
			else this.model = this.$store.getters.generalInfo(key);
			this.loading = false;
		},
		
		onTabValidate: function (property) {
			console.log(property);
		}
	},

	created: function () {
		console.log('general tab created');
		this.fetchData();
	},
	beforeDestroy: function () {
		this.$emit('tab-closing', this.model);
		console.log('destroing general');
	},
	computed: {
		buildingTypes: function () {
			return this.$store.getters.buildingTypes;
		}
	},
	
	mounted: function () {
		console.log('general tab mounted');
	}
})