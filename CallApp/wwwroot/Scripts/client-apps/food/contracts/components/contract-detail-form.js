Vue.component("contract-detail-form", {
    template: "#contract-detail-form",
    mixins: [crossdMixins],
    data: function () {
        return {
            model: {
                ContractID: -1,
                ContractDetailID: -1,
                FoodID: null,
                UnitMeasureID: null,
                Conditions: "",
                Amount: 0,
                Price: 0,
                Sum: 0.0,
                FoodName: "",
                MeasureUnit: 1,
                VATRate: 0,
                RecordStatusID: 1,
                PriceWithVat: 0
            },
            loading: false,
            product: null,
        }
    },

    props: {
        contract: Object,
        detail: Object
    },

    computed: {
        foods: function () {
            return this.$store.getters.foods;
        },

        unitMeasures: function () {
            return this.$store.getters.unitMeasures;
        },

        //priceWithVAT: {
        //    set: function (value) {
        //        var vatRate = this.VATRate;

        //    },

        //    get: function () {
        //        return this.model.Sum * ((100 + this.model.VATRate) / 100);
        //    }
        //}

        priceWithVAT: function () {
            return this.model.Sum * ((100 - this.model.VATRate) / 100);
        },

        //pricePerUnit: function () {
        //    return this.priceWithVAT / this.model.Amount;
        //}

        pricePerUnit: {
            get: function () {
                return this.priceWithVAT / this.model.Amount;
            },

            set: function (value) {

            }
        },

        pricePerUnitWithoutVAT: {
            set: function (value) {
                this.model.Price = value;
            },
            
            get: function () {
                return this.truncateNumber(this.model.Price, 2);
            }

        }
    },

    methods: {
        getFood: function (query) {
            if (query) {
                
                var ids = [];
                if (this.contract && this.contract.Details) {
                    ids = this.contract.Details.map(function (item) {
                        return item.FoodID;
                    });
                }
                this.$store.dispatch("getFoods", { searchString: query, foodIds:ids });
            }
        },

        foodSelected: function (value) {
            this.product = this.$store.getters.getFoodById(value);
            this.model.FoodName = this.product.Name;
            this.model.UnitMeasureID = this.product.UnitMeasureID;
            
            this.getFoodVat(this.contract, this.model.FoodID);
            
        },

        addDetail: function (e) {
            vm = this;
            this.$refs["model"].validate(function (valid) {
                if (valid) {

                    vm.model.ContractID = vm.contract.ContractID;
                    vm.$emit("submit", { type: "add", data: vm.model });
                    
                }
            });
            //this.$refs["model"].resetFields();
            this.model = this.generateNewDetail();
        },

        addDetailAndClose: function () {
            this.addDetail();
            this.$emit("close");
        },

        editDetail: function () {
            this.$emit("submit", { type: "edit", data: this.model , index: this.detail.index });
            this.$emit("close");
        },

        countSum: function (price, amount) {
            this.model.Sum = this.truncateNumber(price * amount, 2);
        },
        
        countPrice: function (sum, amount) {
            var price = sum / amount;
            this.model.Price = this.truncateNumber( price , 2 );
        },

        countPriceWithoutVAT: function (amount) {
            
            this.model.Price = this.priceWithVAT / amount;
        },

        generateNewDetail: function () {
            var contractDetailID = -(Math.abs(this.model.ContractDetailID) + 1);
            
            var model = {
                ContractID: -1,
                ContractDetailID: contractDetailID,
                FoodID: null,
                UnitMeasureID: null,
                Conditions: "",
                Amount: 0,
                Price: 0,
                Sum: 0.0,
                FoodName: "",
                MeasureUnit: 1,
                VATRate: 0,
                RecordStatusID: 1
            }
            
            return model;
        },

        getFoodVat: function (contract, foodId) {
            var vm = this;
            if (contract.IsVAT !== 2) {
                $.ajax({
                    method: "post",
                    url: "/Food/GetFoodVAT/",
                    data: {
                        id: foodId,
                        date: contract.ContractDate
                    },
                    success: function (data) {
                        vm.model.VATRate = data.VatRate;
                    }
                });
                return 0;
            }
        }

    },

    watch: {
        "model.Amount": function (value) {
            if (this.contract.IsVAT === 2) {
                this.countSum(this.model.Price, value);
            } else {
                //this.countPriceWithoutVAT(value)
                this.pricePerUnitWithoutVAT = this.priceWithVAT / this.model.Amount;
            }
        },

        "model.Price": function (value) {
            if (this.contract.IsVAT === 2) {
                this.countSum(value, this.model.Amount);
            } 
                //this.countPriceWithoutVAT(this.model.Amount);
        },

        "model.Sum": function(value){
            if (this.contract.IsVAT === 1) {
                //this.countPriceWithoutVAT(this.model.Amount);
                this.pricePerUnitWithoutVAT = this.priceWithVAT / this.model.Amount;
            }
        },
        //"model.UnitMeasureID": function (value) {
        //    var unitMasure = this.$store.getters.unitMeasures.find(function (item) {
        //        if (item.UnitMeasureID === value) {
        //            return item;
        //        }
        //    });
        //    this.model.MeasureUnit = unitMasure.Name;
        //},

        "detail": function (value) {
            
            if (!value) {
                this.model = this.generateNewDetail();
            } else {
                //this.model.VATRate = getFoodVat(this.contract, this.model.FoodID);
                this.model = value.item;
                this.getFoodVat(this.contract, this.model.FoodID);
            }
        }

    },

    created: function () {
        if (this.detail) {
            this.model = this.detail.item;
            this.getFoodVat(this.contract, this.model.FoodID);
        }
    }
});