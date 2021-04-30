Vue.component("exp-document-edit", {
    template: "#exp-document-edit",
    mixins: [crossdMixins],

    props: {
        documentid: Number
    },
    data: function () {
        return {
            showEditDialog: false,
            products: [],
            model: {
                needToWriteOff: 0,
                needToWriteOffBrutto: 0,
                productRemains: [],
            },
            menuWriteOffValue: 0,
            product: null,
            selectedProduct: null,
            
        };
    },
    watch: {
        "model.productRemains": function (value) {
            
        }
    },
    computed: {
        //packagesRemains: function () {
        //    return 
        //}
        productsInStoreKG: function () {
            return this.model.productRemains.reduce(function (sum, item) {
                sum = sum + item.AmountInKG;
                return sum;
            }, 0.0000);
        },
        
        writeOffBoarders: function () {
            var vm = this;
            var boarders = {
                min: 0,
                max: 0
            };
            if (this.selectedProduct) {
                boarders.min = vm.truncateNumber(this.menuWriteOffValue * 0.97, 5);
                boarders.max = vm.truncateNumber(this.menuWriteOffValue * 1.03, 5);
            }
            return boarders;
        },



        writeOffProducts: function ()
        {
            var vm = this;
            return this.model.productRemains
                .filter(function (item) {
                    return item.WriteOff > 0
                })
                .map(function (item, index) {
                    var newItem = JSON.stringify(item);
                    newItem = JSON.parse(newItem);
                    newItem.Amount = +newItem.WriteOff;
                    newItem.AmountInKG = newItem.IsUndividedPack || newItem.MeasureUnit !== 1
                        ? vm.truncateNumber(newItem.MeasureUnit * (+newItem.WriteOff) / newItem.Koef, 5)
                        : +newItem.WriteOff/newItem.Koef;

                    return newItem;
                });
        },

        writeOffProductsKG: function () {
            var vm = this;
            return this.writeOffProducts.reduce(function (sum, item) {
               
                if (item) {
                    return vm.truncateNumber(sum += item.AmountInKG, 5);
                }
                return vm.truncateNumber(+sum, 5);
            }, 0);
        },
        
        canWriteOff: function () {
            var vm = this;
            var writeOffValue = vm.writeOffProductsKG;
            var comparisionResult = {
                result: "success",
                message: "Можно списать продукты",
                icon: "el-icon-circle-check-outline"
            };

            var unpackagedWriteOff = vm.writeOffProducts.lenght > 0
                ? vm.writeOffProducts.reduce(function (sum, item) {
                    return sum += item.IsUndividedPack === 0
                        ? item.AmountInKG
                        : 0;
                })
                : 0;

            if (writeOffValue < vm.writeOffBoarders.min) {

                var difference = Math.abs(writeOffValue - vm.writeOffBoarders.min);
                //var package = vm.model.productRemains.find(function (item) {
                //    var halfOfpackageCapacity = vm.truncateNumber(item.AmountInKG / item.Amount / 2, 5);
                //    return difference < halfOfpackageCapacity;
                //});


                //console.log("unpackagedWriteOff", unpackagedWriteOff);
                var package = vm.writeOffProducts.find(function (item) {
                    var halfOfCapacity = vm.truncateNumber(item.MeasureUnit / 2, 5);
                    var packagedWriteOff = writeOffValue - unpackagedWriteOff;
                    var extraPackageKG = (item.Amount + 1) * item.MeasureUnit;

                    return item.IsUndividedPack === 1 && difference < halfOfCapacity;
                });

                //console.log(package);

                if (package) {
                    comparisionResult.result = "success";
                    comparisionResult.message = "Недостаточный объем списания (одна упаковка не списана)";
                    comparisionResult.icon = "el-icon-circle-close-outline";
                } else {
                    comparisionResult.result = "too-less";
                    comparisionResult.message = "Недостаточный объем списания";
                    comparisionResult.icon = "el-icon-circle-close-outline";
                }

                //console.log("remains", vm.model.productRemains);
                //console.log("write-off", vm.writeOffProducts);

                return comparisionResult;
            }

            if (writeOffValue > vm.writeOffBoarders.max) {
                
                var difference = Math.abs(writeOffValue - vm.writeOffBoarders.max);
                //var package = vm.model.productRemains.find(function (item) {
                //    var halfOfpackageCapacity = vm.truncateNumber(item.AmountInKG / item.Amount /2, 5);
                //    return difference >= halfOfpackageCapacity;
                //});

                //console.log("unpackagedWriteOff", unpackagedWriteOff);
                var package = vm.writeOffProducts.find(function (item) {
                    var halfOfCapacity = vm.truncateNumber(item.MeasureUnit / 2, 5);


                    var theOnePackage = item.Amount === 1
                        && item.IsUndividedPack === 1
                        && (item.AmountInKG - vm.writeOffProductsKG) === 0

                    return (item.IsUndividedPack === 1 && difference <= halfOfCapacity) || theOnePackage;
                });

               
                if (package) {
                    comparisionResult.result = "success";
                    comparisionResult.message = "Избыточный объем списания (списана доп. упаковка)";
                    comparisionResult.icon = "el-icon-circle-close-outline";
                } else {
                    comparisionResult.result = "too-much";
                    comparisionResult.message = "Избыточный объем списания!";
                    comparisionResult.icon = "el-icon-circle-close-outline";
                }
            }

            if (writeOffValue > vm.productsInStoreKG) {
                
                comparisionResult.result = "out-of-store";
                comparisionResult.message = "Невозможно списать продуктов больше, чем есть на складе"
                comparisionResult.icon = "el-icon-circle-close-outline";
            }

            //console.log("remains", vm.model.productRemains);
            //console.log("write-off", vm.writeOffProducts);

            return comparisionResult;
        },
        
        needToRemainKG: function () {
            return this.model.needToWriteOff - this.writeOffProductsKG;
        }

    },
    methods:{
        click: function () {
            this.showEditDialog = true;

            //$("#jqxgrid").jqxGrid("updatebounddata");
            
        },

        closeDialog: function () {
            this.showEditDialog = false;
        },
        
        getFood: function () {
            console.log('getFoods', this.documentid);
            var vm = this;
            $.ajax({
                async: false,
                method: "get",
                url: "/fooExpDocDetail/GetExpDocDetailsFood/" + this.documentid,
                success: function (data) {
                    vm.products = data;
                }
            });
        },
        
        productSelected: function (product) {
            //console.log(product);
            this.selectedProduct = this.products.find(function (item) {
                return product.NomenclatureID === item.NomenclatureID;
            });
           
            if (this.selectedProduct) {
                this.product = product;
            }
            //console.log(this.selectedProduct);
            var vm = this;
            $.ajax({
                async: false,
                method: "get",
                url: "/fooExpDocDetail/GetFoodRemains/",
                data: {
                    documentId: vm.documentid,
                    //foodId: product,
                    nomenclatureId: product.NomenclatureID//vm.selectedProduct.NomenclatureID
                },
                success: function (data) {
                    console.log(data);
                    var brutto = 0;
                    data.forEach(function (item) {
                        var writedOffProduct = vm.selectedProduct.ExpDocDetails.find(function (detail) {
                            return detail.IncDocDetailID === item.IncDocDetailID;
                        });
                        //console.log(writedOffProduct);
                        if (writedOffProduct) {
                            item.WriteOff = writedOffProduct.Amount;
                            //brutto = item.Brutto;
                        }
                        if (brutto === 0) {
                            brutto = item.Brutto;
                        }
                        
                    });
                    //console.log(brutto);
                    var documentWriteOff = vm.selectedProduct.TotalAmount;
                    //console.log(documentWriteOff);
                    var diff = brutto - documentWriteOff;
                    //console.log("diff",  diff);
                    vm.menuWriteOffValue = brutto;
                    vm.model.productRemains = data;
                    vm.model.needToWriteOff = brutto > 0
                        ? brutto
                        : vm.selectedProduct.TotalAmount;
                    vm.model.needToWriteOffBrutto = vm.model.needToWriteOff;
                }
            });
        },



        writeOff: function () {
            var vm = this;
            //console.log(this.writeOffProducts);
            var data = {
                DocumentID: vm.documentid,
                ReplaceExpDocDetailsIds: this.selectedProduct.ExpDocDetailsIds,
                ExpDocDetails: this.writeOffProducts.map(function (item) {
                    return {
                        DocumentID: vm.documentid,
                        ExpDocDetailID: -1,
                        Amount: item.Amount,
                        IncDocDetailID: item.IncDocDetailID
                    };
                })
            }

            $.ajax({
                method: "post",
                url: "/fooExpDocDetail/WriteOffByRemain",
                contentType: "application/json; charset=UTF-8;",
                //dataType: "json",
                data: JSON.stringify(data),
                success: function (data) {
                    vm.getFood();
                    //console.log(vm.product);
                    //vm.productSelected(vm.product);
                    $("#jqxgrid").jqxGrid('updatebounddata');
                    vm.$message({
                        message: 'Расход ' + vm.selectedProduct.NomenclatureName + ' изменен',
                        type: 'success'
                    });
                    vm.backToList();
                }
            });
        },
        
        backToList: function() {
            this.product = null;
        },
        
        setWriteOff: function (value) {

            value.WriteOff += this.getAllowedWriteOffValue(value);
            
        },
        
        clearWriteOff: function (value) {
            value.WriteOff = 0;
        },

        getAllowedWriteOffValue: function (value) {
            var vm = this;

            var needToRemainAsPackage = null;
            //console.log(value);
            if (value.IsUndividedPack) {
                //console.log(this.needToRemainKG, 'this.needToRemainKG');
                //console.log(value.MeasureUnit, 'value.MeasureUnit');
                //console.log(value.Koef, 'value.Koef');
                needToRemainAsPackage = vm.truncateNumber((vm.needToRemainKG / value.MeasureUnit) * value.Koef)


                // 05.08.2019 - правка ошибки невозможности списать упаковки, хотя списать нужно и на складе они есть
                // проблема возникала, из-за условия ниже, сейчас оно закомментировано
                // причина его устновки не выяснена, допускаю что то это просто ошибка разработчика

                needToRemainAsPackage = needToRemainAsPackage < 0 //|| value.WriteOff - needToRemainAsPackage >= 0
                    ? 0
                    : needToRemainAsPackage;
               
                var isNeedToRemain = vm.needToRemainKG > 0;
                var writedOfProductsAmountInKG = vm.writeOffProducts.reduce(function (sum, item) {
                    sum += item.AmountInKG
                }, 0);

                var isOnePackageEnought = (vm.model.needToWriteOff - (value.MeasureUnit * 1 * value.Koef)) <= 0;

                //console.log(value);
                if (isNeedToRemain && writedOfProductsAmountInKG === 0 && value.WriteOff === 0 && isOnePackageEnought) {
                    return 1;
                }
                var result = value.Amount - value.WriteOff < needToRemainAsPackage 
                    ? vm.truncateNumber((value.Amount - value.WriteOff) * value.Koef)
                    : needToRemainAsPackage;
                return result;
            }

            needToRemainAsPackage = vm.truncateNumber((vm.needToRemainKG / value.MeasureUnit) * value.Koef, 5);
            return value.Amount - value.WriteOff < needToRemainAsPackage
                ? vm.truncateNumber((value.Amount - value.WriteOff) * value.Koef, 5)
                : needToRemainAsPackage;
        },

        onNumberInputChange: function (event, value) {

            //if (event.data === ",") {
                value = Number.parseFloat(event.target.value.replace(/\,/i, '.', '.'));
            //}
            //console.log(value);
        }
    }
});