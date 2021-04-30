Vue.component("product-form", {
    template: "#product-form",
    mixins: [crossdMixins],
    data: function () {
        return {
            model: {
                products:[
                    {
                        FoodID: null,
                        FoodRecipeID: -1,
                        Name: null,
                        Netto: 0,
                        PercentValue: 0,
                        RecordStatusID: 1,
                        IsBoilLoss: 0,
                        Losses: [],
                        ProductData: {
                            Losses: [{ BoilLoss: 0 }],
                            ObjectFoodLoss: {
                                IsIncPercent: 1,
                                LossPercent: 0
                            }
                        }
                        
                    }
                ],
            },
            multiInput: false
        };
    },

    props: {
        products: Array,
        active: Boolean

    },

    computed: {
        foods: function () {
            return this.$store.getters.foods;
        },

        isEdit: function () {
            return this.products.length > 0
        },
        
        isAdd: function () {
            return this.products.length === 0;
        },
    },
    
    methods: {
        getFood: function (query) {
            if (query) {
                this.$store.dispatch("getFoods", { searchString: query, foodIds: [] });
            }
        },

        hasBoilLoss: function (product) {
            if (product.Losses) {
                return product.ProductData.Losses[0].BoilLoss > 0;
            }
            return product.ProductData.Losses === null;
        },

        foodSelected: function (event, value) {
            
            var product = this.$store.getters.getFoodById(event);
            console.log(product);
            value.ProductData.Losses = product.Losses;
            value.ProductData.ObjectFoodLoss = product.ObjectFoodLoss;
            value.IsBoilLoss = 0;
            value.Name = product.Name;
            value.Netto = 0;
            value.PercentValue = this.canSetPercentValue(value) ? 0 : null;

            value.Losses = [];
            this.calcLosses(value);
        },

        canSetPercentValue: function (product) {

            if (!product.ProductData.ObjectFoodLoss) {
                return false;
            }
            return product.ProductData.ObjectFoodLoss.IsIncPercent === 2
                || product.ProductData.ObjectFoodLoss.IsIncPercent === 4;
        },
        


        generateNewModel: function () {
            console.log("model generated");
            var newId = - this.generateUid();
            console.log(newId);

            var newModel = {
                FoodID: null,
                FoodRecipeID: newId,
                Name: null,
                Netto: 0,
                PercentValue: 0,
                RecordStatusID: 1,
                IsBoilLoss: 0,
                Losses: [],
                ProductData: {
                    Losses: [{ BoilLoss: 0 }],

                    ObjectFoodLoss: {
                        IsIncPercent: 1,
                        LossPercent: 0
                    }
                }
            };

            this.model.products.push(newModel);
        },


        removeProduct: function (product, index) {
            console.log("remove")
            this.model.products.splice(index, 1);
        },

        addProducts: function () {
            var vm = this;
            var data = this.model.products;

            //data.forEach(function (item) {
            //    item.Losses = item.Losses;
            //    var bruttoValues = vm.getBruttoValues(item);

            //    item.Losses.forEach(function (loss, index) {
            //        loss.Netto = bruttoValues[index].netto;
            //        loss.Brutto = bruttoValues[index].brutto;
            //    });
            //});


            this.$refs["model"].validate(function (valid) {
                if (valid) {

                    console.log("поточный ввод")
                    
                    vm.$emit("submit", {
                        type: "add",
                        closeDialog: false,
                        data: data
                    });
                }
            });
        },
        
        editProducts: function () {
            var vm = this;
            var data = this.model.products;

            //data.forEach(function (item) {
            //    item.Losses = item.Losses;
            //    var bruttoValues = vm.getBruttoValues(item);

            //    item.Losses.forEach(function (loss, index) {
            //        loss.Netto = bruttoValues[index].netto;
            //        loss.Brutto = bruttoValues[index].brutto;
            //    });
            //});

            this.$refs["model"].validate(function (valid) {
                if (valid) {
                    vm.$emit("submit", {
                        type: "edit",
                        closeDialog: true,
                        data: data
                    });
                }
            });
        },

        prepareForEdit: function (products) {
            var vm = this;
            vm.model.products = [];
            //if (!product.PercentValue) {
            //    product.PercentValue = 0;
            //}
            var productIds = [];
            products.forEach(function (product) {
                //if (!product.PercentValue) {
                //    product.PercentValue = 0;
                //}
                productIds.push(product.FoodID);
            });

            $.ajax({
                method: "post",
                url: "/Food/GetFoodData/",
                data: { searchString: "", foodIds: productIds },
                success: function (data) {
                    
                    //product.ProductData = data[0]
                    data.forEach(function (item, index) {
                        products.forEach(function (product) {
                            if (item.FoodID === product.FoodID) {
                                product.ProductData = item;
                                vm.model.products.push(product);
                            }
                        });
                    });

                    vm.$store.commit("modifyFoods", data);
                }
            });
        },
        
        handleProductChanges: function (value, product) {

            this.calcLosses(product);
        },

        calcLosses: function (product) {
            console.log(product);
            var foodCalculationInputs = {
                FoodID: product.FoodID,
                FoodRecipeID: product.FoodRecipeID,
                Netto: product.Netto,
                PercentValue: this.canSetPercentValue(product) ? product.PercentValue : null,
                IsBoilLoss: product.IsBoilLoss
            };
            
            $.ajax({
                method: "post",
                url: "/fooRecipe/FoodCalculator",
                dataType: "json",
                contentType: "application/json, charsert=utf-8",
                data: JSON.stringify({ foods: [foodCalculationInputs] }),
                success: function (calculations) {
                    product.Losses = calculations.find(function (calc) {
                        return calc.FoodRecipeID === product.FoodRecipeID
                    }).Losses;
                }
            })
        }
    },
    watch: {
        "products": function (value) {
            
            var vm = this;
            if (this.products.length > 0 && this.active) {

                
                vm.prepareForEdit(this.products);
            } else {
                vm.model.products = [];
                this.generateNewModel();
            }
        },

        "active": function (value) {
            console.log(value);
        }

    },
    
    created: function () {
        var vm = this;
        
        if (this.products.length > 0) {

            
            vm.prepareForEdit(this.products);

        } else {
            vm.model.products = [];
            this.generateNewModel();
        }
        
    }
});