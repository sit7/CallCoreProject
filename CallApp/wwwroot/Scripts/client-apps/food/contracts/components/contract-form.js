Vue.component("contract-form", {
    template: "#contract-form",
    mixins: [crossdMixins],
    props: {
        contract: Object,
        mode: String
    },
    data: function () {
        return {
            model: {
                ContractID: -1,
                ContragentID: null,
                ContractNumber: null,
                Description: null,
                ContractDate: new Date(Date.now()).toISOString(),
                BeginDate: new Date(Date.now()).toISOString(),
                EndDate: new Date(Date.now()).toISOString(),
                IsVAT: 2,
                RecordStatusID: 1,
                Details: [],
                ContractSum: 0,
                BeginDateSum: 0,
                dates: [ new Date(Date.now()).toISOString(),  new Date(Date.now()).toISOString()]
            },
            showAddSpecificationDialog: false,
            dateTimePickerOptions: {
                firstDayOfWeek: 1
            },

            detailToEdit: null
        }
    },

    computed: {
        contragents: function(){
            return this.$store.getters.contragents;
        },
    },

    methods: {



        saveContract: function () {
            
            if (this.model.ContractID < 0) {
                this.addContract();
            } else {
                this.editContract();

            }
        },

        editContract: function () {
            var vm = this;
            this.$refs["model"].validate(function (valid, data) {
                if (valid) {
                    vm.model.fooContractDetail = vm.model.Details;
                    $.ajax({
                        url: "/fooContract/Update2/",
                        dataType: "json",
                        contentType: "application/json; charsert=utf-8",
                        method: "post",
                        data: JSON.stringify(vm.model),
                        success: function (response) {
                            
                            if (response.success) {
                                vm.$emit("close", { type: "edit", data: response.data });
                                vm.$refs["model"].resetFields();
                                vm.$message({
                                    showClose: true,
                                    message: "Сведения о договоре добавлены",
                                    type: 'success'
                                });
                            } else {
                                vm.$alert(data, 'Ошибка', {
                                    type: "error",
                                    confirmButtonText: 'OK',
                                });
                            }
                        }
                    });
                }
            });
        },

        addContract: function(){
            var vm = this;
            this.$refs["model"].validate(function (valid, data) {
                if (valid) {
                    
                    vm.model.fooContractDetail = vm.model.Details;
                    $.ajax({
                        url: "/fooContract/Add2/",
                        dataType: "json",
                        contentType: "application/json; charsert=utf-8",
                        method: "post",
                        data: JSON.stringify(vm.model),
                        success: function (response) {
                            if (response.success) {
                                vm.$store.dispatch("addContract", response.data);
                                vm.$emit("close", {type: "add"});
                                vm.$refs["model"].resetFields();
                                vm.$message({
                                    showClose: true,
                                    message: "Сведения о договоре добавлены",
                                    type: 'success'
                                });
                            } else {
                                vm.$alert(data, 'Ошибка', {
                                    type: "error",
                                    confirmButtonText: 'OK',
                                });
                            }
                        }
                    });
                }
            });
        },

        addSpecification: function () {
            this.detailToEdit = null;
            this.showAddSpecificationDialog = true;
        },

        specifiactionWindowClosed: function (data) {
            this.showAddSpecificationDialog = false;
        },

        specificationSubmitted: function (event) {
            
            if (event.type === "add") {
                this.model.Details.push(event.data);
            }
            if (event.type === "edit") {
                
                //this.model.details = this.model.details.map(function (item) {
                //    if (item.CntractDetailID === event.data.CntractDetailID) {
                //        console.log(item);
                //        item = event.data;
                //    }
                    
                //    return item;
                //});
                this.$set(this.model.Details, event.index, event.data);

            }
        },

        contractDatesValidator: function (rule, value, callback) {
            var contractDate = new Date(this.model.ContractDate);
            var beginDate = new Date(this.model.BeginDate);
            var endDate = new Date(this.model.EndDate);


            if (endDate < beginDate){
                callback(new Error("Дата начала действия договора не может быть больше даты окончания"));
            }
            
            if (contractDate > beginDate) {
                callback(new Error("Дата начала действия договора не может быть меньше даты заключения"));
            }

            callback();
        },

        deleteDetail: function (index, detail) {
            if (detail.ContractDetailID < 0) {
                this.model.Details.splice(index, 1);
            } else {
                
                detail.RecordStatusID = 2;

                this.model.Details.splice(index, 1, detail);


            }

        },

        cancelDeleteDetail: function (index, detail) {
            //detail.RecordStatusID = 2;
            this.$set(this.model.Details[index], "RecordStatusID", 1);
            this.model.Details.splice(index, 1, detail);
        },

        prepareContractToEdit: function (value) {
            //value.details = [];
            //value.details = value.Details;
            if (value.Details) {
                var ids = value.Details.map(function (item) {
                    return item.FoodID;
                });
                this.$store.dispatch("getFoods", { searchString: "", foodIds: ids });
            } else {
                value.Details = [];
            }

            this.model = value;
            
        },

        editDetail: function (index, detail) {
            var data = { item: detail, index: index };
            this.detailToEdit = data;
            
            this.showAddSpecificationDialog = true;
        },

        generateNewModel: function () {
            return {
                ContractID: -1,
                ContragentID: null,
                ContractNumber: null,
                Description: null,
                ContractDate: new Date(Date.now()).toISOString(),
                BeginDate: new Date(Date.now()).toISOString(),
                EndDate: new Date(Date.now()).toISOString(),
                IsVAT: 2,
                RecordStatusID: 1,
                Details: [],
                ContractSum: 0,
                BeginDateSum: 0,
                //dates: [new Date(Date.now()).toISOString(), new Date(Date.now()).toISOString()]
            };
        },

        showModel: function () {
            console.log(this.model);
        },

        //getCellClass: function (item) {
        //    var columns = [];
        //    if (this.model.IsVAT === 2) {
        //        columns = [1, 3, 4, 5, 6];
        //    }

        //    if (this.model.IsVAT === 1) {
        //        columns = [1, 3, 4, 5, 6, 7, 8];
        //    }

        //    var cellClass = '';
        //    if (columns.some(function (column) { return item.columnIndex === column })) {
        //        cellClass += "text-right ";
        //    }
        //    return cellClass;
        //}
        handleKey: function (event) {

        }


    },


    watch: {
        "model.dates": function (value) {
            
            if (Array.isArray(value)) {
                value[0] = new Date(value[0]).toISOString();
                value[1] = new Date(value[1]).toISOString();
                this.model.BeginDate = value[0];
                this.model.EndDate = value[1];
            }
            
        },

        "model.ContractDate": function (value) {
            this.model.ContractDate = new Date(value).toISOString();
        },

        "model.BeginDate": function (value) {
            this.model.BeginDate = new Date(value).toISOString();
        },


        "model.EndDate": function (value) {
            this.model.EndDate = new Date(value).toISOString();
        },

        "model.IsVAT": function (value) {
            if (this.model.Details.length > 0) {
                //this.$alert('В договоре уже имеются данные о спецификации, '+
                //    'значения цены за единицу были пересчитаны автоматически, '+ 
                //    'однако настоятельно рекоментуется проверить правильность расчетов',
                //    'Внимание', {
                //        confirmButtonText: 'OK',
                //        type: "warning",
                        
                //});
                if (value === 1 && this.model.Details) {

                    var vm = this;
                    this.model.Detail = this.model.Details.map(function (item) {
                        $.ajax({
                            method: "post",
                            url: "/Food/GetFoodVAT/",
                            data: {
                                id: item.FoodID,
                                date: vm.model.ContractDate
                            },
                            success: function (data) {
                                item.VATRate = data.VatRate;
                                var sumWithoutWAT = item.Sum * ((100 - item.VATRate) / 100);
                                item.Price = sumWithoutWAT / item.Amount;
                                return item;
                            }
                        });

                    });
                    

                    //this.model.Details = this.model.Details.map(function (item) {
                        //var priceWithVAT = item.Price * ((100 + item.VATRate) / 100);
                        //item.Sum = item.Amount * priceWithVAT;

                        //var sumWithoutWAT = item.Sum * ((100 - item.VATRate) / 100);
                        //item.Price = sumWithoutWAT / item.Amount;
                        //return item;
                    //});
                }

                if (value === 2 && this.model.Details) {
                    this.model.Details = this.model.Details.map(function (item) {

                        item.Price = item.Sum / item.Amount;



                        return item;
                    });
                };
            }
        },

        "model.Details": function (value) {
            
            if (value.length > 0) {
                var sum = 0;
                vm = this;
                value.forEach(function (item) {
                    if (item.RecordStatusID === 1) {
                        sum += item.Sum;
                    }
                    
                });
                this.model.ContractSum = this.truncateNumber(sum,2);
            }
        },

        "contract": function (value) {
            if (!value) {
                this.model = this.generateNewModel();
            } else {
                this.prepareContractToEdit(value);
            }
        },

        "model.ContractSum": function (value) {
                //if (("" + value).indexOf(",") > -1) {
                //    value = Number.parseFloat(("" + value).replace(",", "."));
                //    console.log(value);
                //    this.model.ContractSum = value;
                //    console.log(this.model.ContractSum);
                //}
        }
    },

    created: function () {
        this.$store.dispatch("getContragents");
        this.$store.dispatch("getUnitMeasures");
        if (this.contract) {
            this.prepareContractToEdit(this.contract);
        }
    }
});