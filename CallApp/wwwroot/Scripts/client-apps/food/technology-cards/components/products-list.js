Vue.component("products-list", {
    template: "#products-list",
    mixins: [crossdMixins],
    data: function () {
        return {
            selectedProducts: [],
            product: null,
            //products: [],
            showProductDialog: false,
            list: [],
            productsList: [],
            enableEditProducts: false,
        };
    },
    props: {
        products: Array,
        showActions: Boolean,
        mode: String
    },
    computed: {
        isProductsSelected: function () {
            return this.selectedProducts.length > 0;
        },

        disableAddProduct: function () {
            console.log(this.mode);
            if (this.mode !== "create") {
                return !this.enableEditProducts;
            }
            return false;
        },
        
        disableMultiActions: function () {
            if (this.mode !== "create") {
                return !(this.isProductsSelected && this.enableEditProducts)
            }
            return !this.isProductsSelected;
        },

        showProductActions: function () {
            if (this.mode !== "create") {
                return (this.showActions && this.enableEditProducts);
            }
            return true;
        }

    },

    methods: {

        getCellClass: function (item) {

        },


        handleSelectionChange: function (rows) {
            this.selectedProducts = rows;
        },
        
        clearSelected: function () {
            this.$refs.productsTable.clearSelection();
        },
        
        addProduct: function () {
            this.clearSelected();
            this.selectedProducts= [];
            this.showProductDialog = true;
        },

        editProduct: function (product) {
            var cloneProduct = this.cloneData(product);
            this.clearSelected();
            this.selectedProducts = [];
            //console.log(this.selectedProducts);
            this.selectedProducts.push(cloneProduct);
            this.showProductDialog = true;

        },

        deleteProduct: function (product) {
            this.$refs.productsTable.toggleRowSelection(product, false);
            //this.$store.dispatch("removeRecipeProduct", product);
            var vm = this;
            if (product.FoodRecipeID > 0) {
                product.RecordStatusID = 2;
            } else {
                var productIndex = vm.productsList.findIndex(function (item) {
                    return item.FoodRecipeID === product.FoodRecipeID
                });

                vm.productsList.splice(productIndex, 1);
            }
            this.$emit("products-changed", vm.productsList);
        },

        cancelDeleteProduct: function (product) {
            //this.$store.dispatch("cancelRemoveRecipeProduct", product);
            product.RecordStatusID = 1;
            this.$emit("products-changed", this.productsList);
        },

        handleProductAction: function (event) {
            console.log(event);
            var vm = this;
            
            this.showProductDialog = false;

            if (event.type === "edit") {
                vm.productsList.forEach(function (item, index) {
                    var currentToEdit = event.data.find(function(product){
                        return product.FoodRecipeID === item.FoodRecipeID;
                    });

                    if (currentToEdit) {
                        vm.productsList.splice(index, 1, currentToEdit);
                    }
                });
            }

            if (event.type === "add") {
                vm.productsList.concat(event.data);
                event.data.forEach(function (item) {
                    vm.productsList.push(item);
                });
            }
            this.$emit("products-changed", this.productsList);
        },
        
        editSelected: function () {
            this.selectedProducts = this.cloneData(this.selectedProducts);
            
            this.showProductDialog = true;
        },

        deleteSelected: function () {
            var vm = this;
            this.selectedProducts.forEach(function (item, index) {
                vm.deleteProduct(item);
            });
            this.$emit("products-changed", this.productsList);
        },

        setOrderNumber: function (product, index, scope) {
            product.OrderNumber = index+1;
            return product.OrderNumber;
        },

        setProductPosition: function (targetPossition, productIndex, product) {
            var targetIndex = targetPossition - 1;
            var beforeTargetProducts = this.productsList.slice(0, targetIndex)
                .filter(function (item) {
                    return item.FoodRecipeID !== product.FoodRecipeID
                });
            var afterTargetProducts = this.productsList.slice(targetIndex)
                .filter(function (item) {
                    return item.FoodRecipeID !== product.FoodRecipeID
                });

            var replacedList = beforeTargetProducts.concat([product]).concat(afterTargetProducts);

            this.productsList = [].concat(replacedList);
            this.$emit("products-changed", this.productsList);

        },

        getAllowedProductsPositions: function (productPosition) {
            var vm = this;
            return vm.productsList.map(function (item, index) {
                if (index !== productPosition) {
                    return index + 1;
                }
            });
        },

        getList: function () {
            return this.productsList;
        },
        
        showSelectedProducts: function () {
            console.log(this.selectedProducts);
        },
        
        getSelectableRows: function (row, index) {
            if (this.mode !== "create") {
                return this.enableEditProducts;
            }
            return true;
        },
        


        cancelEditProductTab: function () {
            var vm = this;
            vm.$confirm('Вы собираетесь отменить редактирование списка продуктов, изменения будут утеряны. Продолжить?',
                'Редактирование закладки продуктов', {
                confirmButtonText: 'Да',
                cancelButtonText: 'Нет',
                type: 'warning'
            }).then(function () {
                vm.enableEditProducts = false;
                vm.$emit("products-tab-editing", vm.enableEditProducts);

            });


        },
        
        editProductTab: function () {
            var vm = this;
            vm.enableEditProducts = true;
            vm.$emit("products-tab-editing", vm.enableEditProducts);
            //vm.$confirm('При редактировании списка продуктов будет создана новая тенологическая карта. Продолжить?',
            //    'Редактирование закладки продуктов', {
            //    confirmButtonText: 'Да',
            //    cancelButtonText: 'Нет',
            //    type: 'warning'
            //}).then(function() {
            //    vm.enableEditProducts = true;
            //    vm.$emit("products-tab-editing", vm.enableEditProducts);
            //});
        }
    },

    
    watch: {
        "products": function (value) {
            this.productsList = this.cloneData(this.products);
        },
        
        "mode": function (value) {
            if (value === "edit") {
                this.enableEditProducts = false;
            }
            if (value === "create") {
                this.enableEditProducts = true;
            }
        }
    },

    created: function () {
        this.productsList = this.cloneData(this.products);
        if (this.mode === "edit") {
            this.enableEditProducts = false;
        }
        if (this.mode === "create") {
            this.enableEditProducts = true;
        }
    }
});