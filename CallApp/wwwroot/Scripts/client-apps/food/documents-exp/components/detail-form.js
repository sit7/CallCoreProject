Vue.component("detail-form", {
	template: "#detail-form",
    mixins: [crossdMixins],
    data: function () {
        return {
            model: {
                detail:[
                    {
                    	ExpDocDetailID: -vm.generateUid(),
                    	IncDocDetailID: null,
                    	Amount: null,
                    	AmountInKG: null,
                    	DocumentID: null,
                    	DetailNumber: null,
                    	RecordStatusID: 1,
                    	DocStatusID: 1
                     }
                ],
            },
            detailModel: Array,
           
            //remains: [],
            IsEditAmount: 0,
            IsEditPriceWithVAT: 0,
            IsEditPrice:0,
           IsEditSumma:0
        };
    },

    props: {
		document:Object,
		detail: Array,
		remains: Array,
		mode: String
    },

    computed: {
    	dateTimePickerOptions: function () {
    		var vm = this;
    		return {
    			firstDayOfWeek: 1,
     		};
    	},
		
    	isAdd: function () {
    		return this.detail.length === 0;
    	},

      },

    methods: {

    	handleDetailChanges: function (value,field) {
    		var vm = this;

    		var vm = this;
    		if (field === 'IncDocDetailID') {
    			vm.detailModel.FoodName = vm.remains.find(function (item) {
    				return item.IncDocDetailID === vm.detailModel.IncDocDetailID;
    			}).Name;
   
    		}

    		if (field === 'Amount')
    		{
    			vm.detailModel.AmountInKG = vm.detailModel.Amount * vm.detailModel.MeasureUnit;
    			//vm.detailModel.Summa = Math.round(Math.round(vm.detailModel.PriceWithVAT * 100) / 100 * vm.detailModel.Amount * 100) / 100;
    		}
    		if (field === 'AmountInKG') {
    			vm.detailModel.Amount = vm.detailModel.AmountInKG / vm.detailModel.MeasureUnit;
    			//vm.detailModel.Summa = Math.round(Math.round(vm.detailModel.PriceWithVAT * 100) / 100 * vm.detailModel.Amount * 100) / 100;
    		}
    		
    	},

    	getRemains: function (query) {
    		var vm = this;
    		
    			$.ajax({
    				method: "get",
    				url: "/fooExpDocDetail/GetRemainByDocumentID/",
    				data: { documentID: vm.document.DocumentID },
    				success: function (response) {
    					vm.remains = response;
    				}
    			});
    		
        },


        editDetails: function () {

        	var vm = this;
			var data = this.detailModel;
			console.log(data);

			if (this.mode === 'add') {
				this.$refs["model"].validate(function (valid) {
					if (valid) {
						vm.$emit("submit", {
							type: "add",
							closeDialog: true,
							data: data
						});
					}
				});

			}
			else {


				this.$refs["model"].validate(function (valid) {
					if (valid) {
						vm.$emit("submit", {
							type: "edit",
							closeDialog: true,
							data: data
						});
					}
				});
			}
        },
       
        amountValidator: function (rule, value, callback) {

        	var vm = this;
        	/*if (Math.round(value* vm.detailModel.MeasureUnit*100)/100 < Math.round(vm.detailModel.ExpAmount*100)/100) {
        		callback(new Error("Списано " + Math.round(vm.detailModel.ExpAmount / vm.detailModel.MeasureUnit*100)/100 + "шт."));
        	}
        	else {*/
        		callback();
        	/*}*/
        },

    	amountInKGValidator: function (rule, value, callback) {

    		var vm = this;
    		/*if (Math.round(value*100)/100 < Math.round(vm.detailModel.ExpAmount*100)/100) {
    			callback(new Error("Списано " + Math.round(vm.detailModel.ExpAmount*100)/100  + "кг"));
    		}
    		else {*/
    			callback();
    		/*}*/
    	},
       
    	
    },
  
   	
    watch: {
    	"detailModel.IncDocDetailID": function (value) {
    		var vm = this;
    		if (!(vm.detailModel.FoodID == null)) {
    			/*vm.detailModel.FoodName = vm.foods.find(function (item) {
    				return item.FoodID === vm.detailModel.FoodID;
    			}).Name;

				vm.detailModel.PriceFromContract = vm.foods.find(function (item) {
    				return item.FoodID === vm.detailModel.FoodID;
				}).PriceFromContract;

    			vm.detailModel.IsNeedRecalc = vm.foods.find(function (item) {
    				return item.FoodID === vm.detailModel.FoodID;
    			}).IsNeedRecalc;

    			vm.detailModel.LossPercent = vm.foods.find(function (item) {
    				return item.FoodID === vm.detailModel.FoodID;
    			}).LossPercent;

    			vm.detailModel.IsUndividedPack = vm.foods.find(function (item) {
    				return item.FoodID === vm.detailModel.FoodID;
    			}).IsUndividedPack;


    			vm.detailModel.UnitMeasureID = vm.foods.find(function (item) {
    				return item.FoodID === vm.detailModel.FoodID;
    			}).UnitMeasureID;*/

   		}
    		
    	},

     	"detail": function (value) {
    		var vm = this;
    		vm.detailModel = vm.cloneData(vm.detail);
    	},
		
    	"document": function (value) {
    		var vm = this;
    		if (vm.remains.length === 0)
    			vm.getRemains();
    	},
    	"detailModel.UseBeforeDate": function (value) {
    		var vm = this;
    		vm.detailModel.UseBeforeDate = moment(value).toISOString();
    	},

    	"detailModel.CreateDate": function (value) {
    		var vm = this;
    		vm.detailModel.CreateDate = moment(value).toISOString();
    	},


    },
    
    created: function () {
    	var vm = this;
    	if (vm.remains.length === 0)
    		vm.getRemains();
        vm.detailModel = vm.cloneData(vm.detail);
        
        
    }
});