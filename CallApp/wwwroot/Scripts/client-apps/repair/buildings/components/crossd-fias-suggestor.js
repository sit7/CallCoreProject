

Vue.component("crossd-fias-suggestor", {
	template: "#crossd-fias-suggestor",
	props: {
		
		coordinates: {},
		value: '',
	},
	data: function () {
		return {
			
			coords: {
				latitude: '',
				longitude: ''
			},
			options: {
				type: "ADDRESS",
				token: "0289160a02213271903b8c31ce47c670c58c3093",

				scrollOnFocus: true,
				triggerSelectOnBlur: false,
				triggerSelectOnEnter: false,
				addon: 'none',
				onSelect(suggestion) {
					console.log(suggestion);
				}
			}
		}
	},
	mounted: function () {
		this.callbacks = $.Callbacks();
		this.initSuggestion();
	},
	destroyed: function () {
		this.destroySuggestion();
	},
	watch: {
		coords: {
			handler: function () {
				this.$emit('update:coordinates', this.coords);
			},
			deep: true
		},
		
	},
	methods: {
		onChange: function () {
			console.log('change');
		},
		initSuggestion: function() {
			this.callbacks.add(this.onSelect);
			this.callbacks.add(this.options.onSelect || $.noop)
			const options = Object.assign({}, this.options, {
				onSelect: suggestion =>
					this.callbacks.fire(suggestion)
			});
			$(this.$el).suggestions(options);
		},
		destroySuggestion: function() {
			const plugin = $(this.$el).suggestions();
			plugin.dispose();
		},
		onSelect: function(suggestion) {
			console.log('suggest... ');
			this.value = suggestion.value;
			const { geo_lat, geo_lon } = suggestion.data;
			this.coords.latitude = geo_lat;
			this.coords.longitude = geo_lon;
		}

	}
});