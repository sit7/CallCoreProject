Vue.component("building-misc-tab", {
	template: "#building-misc-tab",
	mixins: [crossdMixins],
	data: function () {
		return {
			model: {
				Comment: String,
				MaxKidsCount: Number,
				LandKadastrNumber: String,
				BeautificationPlan: String
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
			if (key === undefined) this.model = this.$store.getters.miscInfoDefault;
			else this.model = this.$store.getters.miscInfo(key);
			this.loading = false;
		},
		
		onTabValidate: function (property) {
			console.log(property);
		}
	},

	created: function () {
		console.log('misc tab created');
		this.fetchData();
	},
	beforeDestroy: function () {
		this.$emit('tab-closing', this.model);
		console.log('destroing misc');
	},
	
	mounted: function () {
		console.log('misc tab mounted');
	}
})