Vue.component("details-list", {
    template: "#details-list",
    mixins: [crossdMixins],
    data: function () {
        return {
            detail: null,
            showDetailDialog: false,
            list: [],
            detailsList: [],
			cloneDetail: null
        };
    },
    props: {
    	details: Array,
    	document:Array,
    	remains:Array,
        showActions: Boolean,
        mode: String
    },
    computed: {
    	documentSumm: function () {
    		var vm = this;
    		if (vm.expDetails) {
    			if (vm.expDetails.length > 0) {

    				return vm.expDetails.reduce(function (result, current) {
    					return result += current.Summa;
    				}, 0);
    			}
    		}
    		return 0;
    	},


    },

    methods: {


    	addDetail: function () {
    		var vm = this;
    		//this.cloneDetail = null;
    		this.cloneDetail = {
    			ExpDocDetailID: -vm.generateUid(),
    			IncDocDetailID: null,
    			Amount: null,
    			AmountInKG: null,
    			DocumentID: null,
    			DetailNumber: null,
    			RecordStatusID: 1,
				DocStatusID:1
    		};
			this.mode = 'add';
    		this.showDetailDialog = true;
        },
		
    	editDetail: function (detail) {
    		this.cloneDetail = this.cloneData(detail);
			this.mode = 'edit';
            //this.clearSelected();
    		this.showDetailDialog = true;

        },

    	deleteDetail: function (detail) {
    		var vm = this;

    		if (detail.ExpDocDetailID > 0) {
            	detail.RecordStatusID = 3 - detail.RecordStatusID;
            } else {
            	var detailIndex = vm.detailsList.findIndex(function (item) {
                	return item.FoodID === detail.FoodID
                });

            	vm.detailsList.splice(detailIndex, 1);
            }
            this.$emit("details-changed", this.detailsList);
        },
		 handleDetailAction: function (event) {
		 	console.log(event);

            var vm = this;
            console.log(vm.detailsList);
            this.showDetailDialog = false;

            if (event.type === "edit") {
                vm.detailsList.forEach(function (item, index) {
                	/*var currentToEdit = event.data.find(function(product){
                		return product.FoodRecipeID === item.FoodRecipeID;
                	});*/

                	if (event.data.ExpDocDetailID === item.ExpDocDetailID) {
                		vm.detailsList.splice(index, 1, event.data);
                    }
                });
            }

            if (event.type === "add") {
            	//vm.detailsList.concat(event.data);
            	vm.detailsList.push(event.data);
            
            }
            this.$emit("details-changed", this.detailsList);
		 },
		
		 setOrderNumber: function (product, index, scope) {
		 	product.DetailNumber = index + 1;
		 	return product.DetailNumber;
		 },

		 setProductPosition: function (targetPossition, productIndex, product) {
		 	var targetIndex = targetPossition - 1;
		 	var beforeTargetProducts = this.detailsList.slice(0, targetIndex)
                .filter(function (item) {
                	return item.ExpDocDetailID !== product.ExpDocDetailID
                });
		 	var afterTargetProducts = this.detailsList.slice(targetIndex)
                .filter(function (item) {
                	return item.ExpDocDetailID !== product.ExpDocDetailID
                });

		 	var replacedList = beforeTargetProducts.concat([product]).concat(afterTargetProducts);

		 	this.detailsList = [].concat(replacedList);
		 	this.$emit("details-changed", this.detailsList);

		 },

		 getAllowedProductsPositions: function (productPosition) {
		 	var vm = this;
		 	return vm.detailsList.map(function (item, index) {
		 		if (index !== productPosition) {
		 			return index + 1;
		 		}
		 	});
		 },
    },

    
    watch: {
        "details": function (value) {
        	this.detailsList = this.cloneData(this.details);
        },

     },

    created: function () {
    	if (this.details)
    	this.detailsList = this.cloneData(this.details);
     }
});