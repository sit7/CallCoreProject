Vue.component("request-filter", {
	template: "#request-filter",
	
    data: function () {
        var vm = this;
        var model = RequestArgModel()
        return {
            arg: vm.args,
            argmodel: vm.model,
            descriptor: vm.model.descriptor
        };
	},

	props: {
        model: {
            type: Object
        },
        args: {
            type: Object
        }
	},

	computed: {
		
	
	
    },

    mounted: function () {
        this.descriptor.forEach((v, i, a) => {
            if (v.isListItems == true)
                v.listValue.source(v);
        });
    },
	
	methods: {
		emitFilterApply: function () {
			this.$emit('apply', this.args);
		},
		resetFields: function () {
			this.$refs['filterform'].resetFields();
			this.emitFilterApply();
		},
	},
	created: function() {
        console.log('request filter created');
	}
	
})