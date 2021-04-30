Vue.component("detail-form", {
	template: "#detail-form",
    mixins: [crossdMixins],
    data: function () {
        return {
            model: {
                detail:[
                    {
                    	IncDocDetailID: -1,
                    	FoodID: null,
                    	Amount: null,
                    	AmountInKG: null,
                    	VATRate: 20,
                    	Excise: 0,
                    	DocumentID: null,
                    	Date: new Date(Date.now()).toISOString(),
                    	FoodName: '',
                    	DetailNumber: null,
                    	UnitMeasureID: 1,
                    	MeasureUnit: 1,
                    	IsUndividedPack: 1,
                    	LossPercent: 0,
                    	UseBeforeDate: new Date(Date.now()).toISOString(),
                    	CreateDate: new Date(Date.now()).toISOString(),
                    	Price: 1,
						PriceFromContract: 1,
                    	PriceWithVAT: 1.2,
                    	Summa: 0,
                    	IsNeedRecalc: 1,
                    	SaveTerm: 0,
						RecordStatusID: 1
                     }
                ],
            },
            detailModel: Array,
           
            ProductID: null,
            foods: [],
            IsEditAmount: 0,
            IsEditPriceWithVAT: 0,
            IsEditPrice:0,
           IsEditSumma:0
        };
    },

    props: {
		document:Object,
		detail: Array,
		foods: Array,
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

    	PriceFromContractLabel: function () {
    		return "Цена из договора, р. за " + this.detail.IsNeedRecalc == 1 ? "кг" : "шт";
    	},

    	disableFoodIDCondition: function () {
    			return (this.document.DocumentStatusID == 2 || this.detail.ExpAmount > 0)
    	},

    	disableIsUndividedPackCondition: function () {
    		return (this.detail.ExpAmount > 0)
    	},
    	disableAmountCondition: function () {
    		return (this.document.DocumentStatusID == 2)
    	},

     },

    methods: {

    	handleDetailChanges: function (value,field) {
    		var vm = this;

    		var vm = this;
    		if (field === 'FoodID') {
    			vm.detailModel.FoodName = vm.foods.find(function (item) {
    				return item.FoodID === vm.detailModel.FoodID;
    			}).Name;

    			/*vm.detailModel.PriceFromContract = vm.foods.find(function (item) {
    				return item.FoodID === vm.detailModel.FoodID;
    			}).PriceWithVAT;*/

    			vm.detailModel.IsNeedRecalc = vm.foods.find(function (item) {
    				return item.FoodID === vm.detailModel.FoodID;
    			}).IsNeedRecalc;

    			vm.detailModel.MeasureUnit = vm.foods.find(function (item) {
    				return item.FoodID === vm.detailModel.FoodID;
    			}).MeasureUnit;

    			vm.detailModel.PriceWithVAT = vm.detailModel.IsNeedRecalc == 0 ? vm.foods.find(function (item) {
    				return item.FoodID === vm.detailModel.FoodID;
    			}).Price : vm.foods.find(function (item) {
    				return item.FoodID === vm.detailModel.FoodID;
    			}).Price * vm.detailModel.MeasureUnit;

    			vm.detailModel.PriceFromContract = vm.detailModel.PriceWithVAT;

    			vm.detailModel.IsUndividedPack = vm.foods.find(function (item) {
    				return item.FoodID === vm.detailModel.FoodID;
    			}).IsUndividedPack;

    			vm.detailModel.VATRate = vm.foods.find(function (item) {
    				return item.FoodID === vm.detailModel.FoodID;
    			}).VATRate;

    			vm.detailModel.Price = vm.detailModel.PriceWithVAT / (1 + vm.detailModel.VATRate / 100);

    			vm.detailModel.Summa = Math.round(Math.round(vm.detailModel.PriceWithVAT * 100) / 100 * vm.detailModel.Amount * 100) / 100;

    			vm.detailModel.SaveTerm = vm.foods.find(function (item) {
    				return item.FoodID === vm.detailModel.FoodID;
    			}).SaveTerm;
    		}

    		if (field === 'Amount')
    		{
    			vm.detailModel.AmountInKG = vm.detailModel.Amount * vm.detailModel.MeasureUnit;
    			vm.detailModel.Summa = Math.round(Math.round(vm.detailModel.PriceWithVAT * 100) / 100 * vm.detailModel.Amount * 100) / 100;
    		}
    		if (field === 'AmountInKG') {
    			vm.detailModel.Amount = vm.detailModel.AmountInKG / vm.detailModel.MeasureUnit;
    			vm.detailModel.Summa = Math.round(Math.round(vm.detailModel.PriceWithVAT * 100) / 100 * vm.detailModel.Amount * 100) / 100;
    		}
    		if (field === 'Summa') {
    			vm.detailModel.PriceWithVAT = vm.detailModel.Summa / vm.detailModel.Amount;
    			vm.detailModel.Price = vm.detailModel.PriceWithVAT / (1 + vm.detailModel.VATRate / 100);
    		}
    		if (field === 'Price') {
    			vm.detailModel.PriceWithVAT = vm.detailModel.Price / (1 - vm.detailModel.VATRate / 100);
    			vm.detailModel.Summa = vm.detailModel.Amount * vm.detailModel.Price / (1 - vm.detailModel.VATRate / 100);
    		}
    		if (field === 'PriceWithVAT') {
    			vm.detailModel.Price = vm.detailModel.PriceWithVAT / (1 + vm.detailModel.VATRate / 100);
    			vm.detailModel.Summa = Math.round(Math.round(vm.detailModel.PriceWithVAT * 100) / 100 * vm.detailModel.Amount * 100) / 100;
    		}
    		if (field === 'VATRate') {
    			vm.detailModel.Price = vm.detailModel.PriceWithVAT / (1 + vm.detailModel.VATRate / 100);
    		}

    		if (field === 'MeasureUnit') {
    			vm.detailModel.AmountInKG = vm.detailModel.Amount * vm.detailModel.MeasureUnit;
    			if (vm.detailModel.IsNeedRecalc == 0) {
    				vm.detailModel.PriceWithVAT = vm.detailModel.PriceFromContract;
    				vm.detailModel.Price = vm.detailModel.PriceWithVAT / (1 + vm.detailModel.VATRate / 100);
    				vm.detailModel.Summa = Math.round(Math.round(vm.detailModel.PriceWithVAT * 100) / 100 * vm.detailModel.Amount * 100) / 100;
    				
    			}
    			else {
    				vm.detailModel.PriceWithVAT = vm.detailModel.PriceFromContract * vm.detailModel.MeasureUnit;
					vm.detailModel.Price = vm.detailModel.PriceWithVAT / (1 + vm.detailModel.VATRate / 100);
					vm.detailModel.Summa = Math.round(Math.round(vm.detailModel.PriceWithVAT * 100) / 100 * vm.detailModel.Amount * 100) / 100;
    			}
    		}

    		if (field === 'CreateDate') {
    			this.detailModel.UseBeforeDate = moment(this.detailModel.CreateDate).add(vm.detailModel.SaveTerm == null ? 0 : vm.detailModel.SaveTerm, 'days')
    		}

    		if (field === 'SaveTerm') {
    			this.detailModel.UseBeforeDate = moment(this.detailModel.CreateDate).add(vm.detailModel.SaveTerm == null ? 0 : vm.detailModel.SaveTerm, 'days')
    		}
    	},

    	getFood: function (query) {
    		var vm = this;
    		if (vm.document.ContractID == null) {
    			$.ajax({
    				method: "get",
    				url: "/Food/GetFoods/",

    				success: function (response) {
    					vm.foods = response;
    				}
    			});
    		}
    		else {
    			$.ajax({
    				method: "post",
    				url: "/Food/GetFoodsForIncByContract/",
    				
    				data: {
    						searchString: query,
							docDate: vm.parseDate(vm.document.DocDate),
							contractID: vm.document.ContractID,
							contragentID: vm.document.ContragentID
						},
    				success: function (response) {
    					vm.foods = response;
    				}
    			});
    		}
        },




        generateNewModel: function () {
 
        },


 

       /* addDetail: function () {
        	console.log("поточный ввод")
 
        	var vm = this;
        	var data = this.detailModel;


        	this.$refs["model"].validate(function (valid) {
        		if (valid) {
        			vm.$emit("submit", {
        				type: "add",
        				closeDialog: true,
        				data: data
        			});
        		}
        	});
        },*/

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
        	if (Math.round(value* vm.detailModel.MeasureUnit*100)/100 < Math.round(vm.detailModel.ExpAmount*100)/100) {
        		callback(new Error("Списано " + Math.round(vm.detailModel.ExpAmount / vm.detailModel.MeasureUnit*100)/100 + "шт."));
        	}
        	else {
        		callback();
        	}
        },

    	amountInKGValidator: function (rule, value, callback) {

    		var vm = this;
    		if (Math.round(value*100)/100 < Math.round(vm.detailModel.ExpAmount*100)/100) {
    			callback(new Error("Списано " + Math.round(vm.detailModel.ExpAmount*100)/100  + "кг"));
    		}
    		else {
    			callback();
    		}
    	}
       
    },
  

 

    	
    watch: {
    	"detailModel.FoodID": function (value) {
    		var vm = this;
    		if (!(vm.detailModel.FoodID == null)) {
    			/*vm.detailModel.FoodName = vm.foods.find(function (item) {
    				return item.FoodID === vm.detailModel.FoodID;
    			}).Name;*/

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
    			}).UnitMeasureID;

   		}
    		
    	},

  
    	"detailModel.MeasureUnit": function (value) {
    		
    	},

    	"detail": function (value) {
    		var vm = this;
    		vm.detailModel = vm.cloneData(vm.detail);
    	},
		
    	"detailModel.CreateDate": function (value) {
    		var vm = this;
    		this.detailModel.CreateDate = moment(value).toISOString();
 
    	},

    	"detailModel.UseBeforeDate": function (value) {
    		this.detailModel.UseBeforeDate = moment(value).toISOString();
    		this.detailModel.SaveTerm = (moment(this.detailModel.UseBeforeDate) - moment(this.detailModel.CreateDate)) /(60*60*24*1000);
    		},
		
    	"document": function (value) {
    		var vm = this;
    		if (vm.foods.length === 0)
    		vm.getFood();
    	},

    	"document.ContractID": function (value) {
    		var vm = this;
    		if (vm.foods.length === 0)
    		vm.getFood();
    	},
        
    },
    
    created: function () {
    	var vm = this;
    	if (vm.foods.length === 0)
			  vm.getFood();
        vm.detailModel = vm.cloneData(vm.detail);
        if (this.detail.IncDocDetailID > 0) {
            
        	//vm.prepareForEdit(this.detail);

        } else {
            vm.model.detail = [];
            this.generateNewModel();
        }
        
    }
});