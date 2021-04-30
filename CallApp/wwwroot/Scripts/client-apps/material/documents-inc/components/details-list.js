Vue.component("details-list", {
    template: "#details-list",
    mixins: [crossdMixins],
    data: function () {
        return {
            //selectedDetails: [],
            detail: null,
            //products: [],
            showDetailDialog: false,
            list: [],
            detailsList: [],
			cloneDetail: null
        };
    },
    props: {
    	details: Array,
    	document:Array,
    	foods:Array,
        showActions: Boolean,
        mode: String
    },
    computed: {
    	documentSumm: function () {
    		var vm = this;
    		if (vm.detailsList) {
    			if (vm.detailsList.length > 0) {

    				return vm.detailsList.reduce(function (result, current) {
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
    			IncDocDetailID: -vm.generateUid(),
    			FoodID: null,
    			Amount: null,
    			AmountInKG: null,
    			VATRate: 20,
    			Excise: 0,
    			DocumentID: null,
    			Date: new Date(Date.now()).toISOString(),
    			FoodName: '',
    			DetailNumber: null,
    			MeasureUnit: 1,
    			UnitMeasureID: 1,
    			IsUndividedPack: 1,
    			LossPercent: 0,
    			UseBeforeDate: new Date(Date.now()).toISOString(),
    			CreateDate: new Date(Date.now()).toISOString(),
    			Price: 1,
    			PriceFromContract: 1,
    			PriceWithVAT: 1.2,
    			Summa: 0,
    			IsNeedRecalc: 0,
    			SaveTerm: 0,
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

            if (detail.FoodID > 0) {
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

                	if (event.data.IncDocDetailID === item.IncDocDetailID) {
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
                	return item.IncDocDetailID !== product.IncDocDetailID
                });
		 	var afterTargetProducts = this.detailsList.slice(targetIndex)
                .filter(function (item) {
                	return item.IncDocDetailID !== product.IncDocDetailID
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

        "details.CreateDate": function (value) {
        	this.details.CreateDate = moment(value).toISOString();
        },
		
        "details.UseBeforeDate": function (value) {
        	this.details.UseBeforeDate = moment(value).toISOString();
        },
        
     },

    created: function () {
    	if (this.details)
    	this.detailsList = this.cloneData(this.details);
     }
});