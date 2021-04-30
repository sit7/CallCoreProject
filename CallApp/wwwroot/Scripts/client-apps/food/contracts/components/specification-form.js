Vue.component("specification-form", {
    template: "#specification-form",
    mixins: [crossdMixins],
    data: function () {
        return {
            selectedProducts: [],
            
            product: null,
            products: [],
            isEditingEnabled: false
        }
    },


    props: {
        contract: Object,
        //products: Array
    },

    computed: {
        foods: function () {
            return this.$store.getters.foods;
        },

        unitMeasures: function () {
            return this.$store.getters.unitMeasures;
        },

        selectedProductsCount: function () {
            return this.selectedProducts.length;
        },

        specificationSumm: function () {
            var vm = this;
            if (vm.products.length > 0) {

                return vm.products.reduce(function (result, current) {
                    return result += current.Summa;
                },0);
            }
            return 0;
        },

        specificationSummStyle: function () {
            return {
                color: (this.specificationSumm > this.contract.ContractSum)
                    ? "#ff0000"
                    : "#47a300"
            };
        },
    },

    methods: {
        handleSelectionChange: function (value) {
            var vm = this;
            vm.selectedProducts = vm.cloneData(value);
            if (value.length === 0) {
                vm.clearSelected();
            }
        },

        clearSelected: function () {
            var vm = this;

            //if (vm.product.ContractDetailID < 0) {
            //    vm.product = vm.generateNewProduct();
            //}
            vm.product = vm.generateNewProduct();
            vm.isEditingEnabled = false;
            vm.$refs.productsTable.clearSelection();
        },

        littleDifference: function (rule, value, callback) {
            var vm = this;
            if (value !== 0 && vm.product.Amount !== 0 && vm.product.PriceWithVAT) {
                var sum = vm.product.Amount * vm.product.PriceWithVAT;
                console.log(sum);
                var difference = Math.abs(sum - value);
                console.log(difference);
                if (difference >= 0.02) {
                    callback(new Error("Значение суммы должно быть произведением цены за единицу и количества"));
                }
            }
            callback();
        },

        saveProduct: function () {
            var vm = this;
            vm.$refs["form"].validate(function (valid, data) {
                if (valid) {

                    if (vm.isEditingEnabled ) {

                        $.ajax({
                            method: "post",
                            url: "/fooContractDetail/Update2",
                            dataType: "json",
                            contentType: "application/json; charsert=utf-8",
                            data: JSON.stringify(vm.product),
                            success: function (response) {
                                if (response.success) {
                                    var product = response.data;
                                    var productIndex = vm.selectedProducts.find(function (item, index) {
                                        return item.ContractDetailID === product.ContractDetailID;
                                    });


                                    for (var i = 0; i < vm.products.length; i++) {
                                        if (vm.products[i].ContractDetailID === product.ContractDetailID) {
                                            
                                            vm.$set(vm.products, i, product);
                                            i = vm.products.length - 1;
                                        }
                                    }

                                    vm.selectedProducts.splice(productIndex, 1);

                                    if (vm.selectedProducts.length > 0) {

                                        var nextIndex = 1;

                                        if (productIndex >= vm.selectedProducts.length - 1) {
                                            nextIndex = (vm.selectedProducts.length);
                                        }
                                        var isRemovedProductNotFirstAndNotLast = (productIndex > 0) && (productIndex < vm.selectedProducts.length - 1);
                                        if (isRemovedProductNotFirstAndNotLast) {
                                            nextIndex = productIndex + 1;
                                        }


                                        vm.editingItemChange(nextIndex);

                                        //vm.selectedProducts = vm.selectedProducts.findIndex(function (item) {
                                        //    return item.ContractDetailID !== product.ContractDetailID;
                                        //});

                                    } else {
                                        vm.product = vm.generateNewProduct();
                                        vm.clearSelected();
                                        vm.$refs["form"].resetFields();

                                    }

                                } else {
                                    vm.$alert(data.message, 'Ошибка', {
                                        type: "error",
                                        confirmButtonText: 'OK'
                                    });
                                }

                                vm.$emit("specification-changed", {
                                    ContractID: vm.contract.ContractID,
                                    Positions: vm.products.length
                                });
                            }
                        });



                    } else {
                        $.ajax({
                            method: "post",
                            url: "/fooContractDetail/Add2",
                            dataType: "json",
                            contentType: "application/json; charsert=utf-8",
                            data: JSON.stringify(vm.product),
                            success: function (response) {
                                if (response.success) {
                                    var product = response.data;
                                    vm.products.push(vm.cloneData(product));
                                    vm.product = vm.generateNewProduct();
                                    vm.$refs["form"].resetFields();
                                    vm.isEditingEnabled = false;
                                } else {
                                    vm.$alert(data.message, 'Ошибка', {
                                        type: "error",
                                        confirmButtonText: 'OK',
                                    });
                                }
                                vm.$emit("specification-changed", {
                                    ContractID: vm.contract.ContractID,
                                    Positions: vm.products.length
                                });
                            }
                        });
                    }
                }
            });
        },

        getFood: function (query) {
            if (query) {

                var ids = this.selectedProducts.map(function (item) { return item.FoodID; });
                //if (this.contract && this.contract.Details) {
                //    ids = this.contract.Details.map(function (item) {
                //        return item.FoodID;
                //    });
                //}
                this.$store.dispatch("getFoods", { searchString: query, foodIds: ids });
            }
        },

        foodSelected: function (value) {
            var productData = product = this.$store.getters.getFoodById(value);
            this.product.FoodName = productData.Name;
            this.product.UnitMeasureID = productData.UnitMeasureID;

            this.getFoodVat(this.contract, this.product.FoodID);

        },


        getFoodVat: function (contract, foodId) {
            var vm = this;
            console.log(contract);
            if (contract.IsVAT !== 2) {
                $.ajax({
                    method: "post",
                    url: "/Food/GetFoodVAT/",
                    data: {
                        id: foodId,
                        date: vm.parseDate(contract.ContractDate)
                    },
                    success: function (data) {
                        vm.product.VATRate = data.VatRate;
                    }
                });
            }
        },

        generateNewProduct: function () {
            var vm = this;
            return {
                ContractID: vm.contract.ContractID,
                ContractDetailID: -1 * vm.generateUid(),
                FoodID: null,
                UnitMeasureID: null,
                Conditions: "",
                Amount: 0,
                Price: 0,
                PriceWithVAT: 0,
                Summa: 0.0,
                FoodName: "",
                MeasureUnit: 1,
                VATRate: 0,
                RecordStatusID: 1
            };
        },

        initEditing: function () {
            var vm = this;
            console.log(vm.selectedProducts);
            vm.getFood(" ");
            vm.product = vm.selectedProducts[0];
            
            vm.isEditingEnabled = true;
            
        },

        editingItemChange: function (itemIndex) {
            var vm = this;
            vm.product = vm.selectedProducts[itemIndex-1];
        },

        deleteItems: function () {
            var vm = this;
            var ids = vm.selectedProducts.map(function (item) {
                return item.ContractDetailID;
            });

            $.ajax({
                method: "post",
                url: "/fooContractDetail/Delete",
                dataType: "json",
                contentType: "application/json; charsert=utf-8",
                data: JSON.stringify({ ids: ids }),
                success: function (data) {
                    vm.products = vm.products.filter(function (item) {
                        return !ids.some(function (id) {
                            return id === item.ContractDetailID;
                        });
 
                    });
                    vm.$emit("specification-changed", {
                        ContractID: vm.contract.ContractID,
                        Positions: vm.products.length
                    });
                }

            });
        },

        getDetails: function () {
            var vm = this;
            $.ajax({
                method: "get",
                url: "/fooContractDetail/GetContractDetails2/" + vm.contract.ContractID,
                success: function (data, status, xhr) {
                    
                    vm.products = data;
                }
            });
        }

    },

    watch: {
        "selectedProducts": function (value) {
        },

        "product": function (value) {
            var vm = this;
            vm.$refs["form"].resetFields();
        },

        "contract": function (value) {
        	console.log(value);
        	var vm = this;
			vm.product = vm.generateNewProduct();
            this.getDetails();
            this.$refs["form"].resetFields();
        },

        "product.Amount": function (value) {
            var vm = this;
            var price = vm.product.PriceWithVAT;
            vm.product.Summa = price * value;
        },

        "product.PriceWithVAT": function (value) {
            var vm = this;
            var amount = vm.product.Amount;
            vm.product.Summa = amount * value;
        }
    },

    created: function () {
        var vm = this;
        console.log(vm.contract);
        vm.$store.dispatch("getUnitMeasures");
        vm.product = vm.generateNewProduct();
       
        vm.getDetails();
    }
});