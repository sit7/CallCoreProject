Vue.component("building-square-tab", {
	template: "#building-square-tab",
	mixins: [crossdMixins],

	data: function () {
		return {
			model: {
				MainBuildingArea: Number,
				AuxiliaryBuildingArea: Number,
				LandArea: Number,
				LandToBeautification: Number
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
			if (key === undefined) this.model = this.$store.getters.squareInfoDefault;
			else this.model = this.$store.getters.squareInfo(key);
			this.loading = false;
		},
		onTabValidate: function (property) {
			console.log(property);
		}
	},
	beforeDestroy: function () {
		this.$emit('tab-closing', this.model);
		console.log('destroing square');
	},
	created: function () {
		this.fetchData();
	}
})