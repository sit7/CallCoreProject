Vue.component("contract-form-new", {
    template: "#contract-form-new",
    mixins: [crossdMixins],
    props: {
        contract: Object,
        mode: String,
        counteragent: Object
    },
    data: function () {
        return {
            dateTimePickerOptions: {
                firstDayOfWeek: 1
            },

            needSpecification: false
        };
    },

    methods: {
        contractDateValidator: function (rule, value, callback) {
            var vm = this;
            //var contractDate = new Date(vm.parseDate(vm.contract.ContractDate));
            //var beginDate = new Date(vm.parseDate(vm.contract.BeginDate));
            //var endDate = new Date(vm.parseDate(vm.contract.EndDate));

            //console.log(contractDate);
            //console.log(beginDate);
            //console.log(endDate);
            //console.log(vm.contract);


            if (moment(vm.contract.ContractDate).isAfter(vm.contract.BeginDate, "day")) {
                callback(new Error("Дата заключения договора не может быть больше даты начала действия"));
            }

            if (moment(vm.contract.ContractDate).isAfter(vm.contract.EndDate, "day")) {
                callback(new Error("Дата заключения договора не может быть больше даты окончания действия"));
            }
            callback();
        },

        beginDateValidator: function (rule, value, callback) {
            var vm = this;
            //var contractDate = new Date(vm.parseDate(vm.contract.ContractDate));
            //var beginDate = new Date(vm.parseDate(vm.contract.BeginDate));
            //var endDate = new Date(vm.parseDate(vm.contract.EndDate));

            //console.log(contractDate);
            //console.log(beginDate);
            //console.log(endDate);
            //console.log(vm.contract);
            if (moment(vm.contract.ContractDate).isAfter(vm.contract.BeginDate, "day")) {
                callback(new Error("Дата начала действия договора не может быть меньше даты заключения"));
            }

            if (moment(vm.contract.ContractDate).isAfter(vm.contract.EndDate, "day")) {
                callback(new Error("Дата начала действия договора не может больше даты окончания"));
            }
            callback();
        },

        endDateValidator: function (rule, value, callback) {
            var vm = this;
            var contractDate = new Date(vm.parseDate(vm.contract.ContractDate));
            var beginDate = new Date(vm.parseDate(vm.contract.BeginDate));
            var endDate = new Date(vm.parseDate(vm.contract.EndDate));

            if (moment(vm.contract.BeginDate).isAfter(vm.contract.EndDate, "day")) {
                callback(new Error("Дата окончания действия договора не может быть меньше даты начала действия"));
            }

            if (moment(vm.contract.ContractDate).isAfter(vm.contract.EndDate, "day")) {
                callback(new Error("Дата окончания действия договора не может быть меньше даты заключения"));
            }

            callback();
        },

        saveContract: function () {
            var vm = this;
            console.log(vm.contract);
            vm.contract.RecordStatusID = 1;

            this.$refs["form"].validate(function (valid, data) {
                if (valid) {
                    if (vm.contract.ContractID < 0) {
                        $.ajax({
                            url: "/fooContract/Add2/",
                            dataType: "json",
                            contentType: "application/json; charsert=utf-8",
                            method: "post",
                            data: JSON.stringify(vm.contract),
                            success: function (response) {
                                if (response.success) {
                                    //vm.$store.dispatch("addContract", response.data);
                                    //vm.$emit("close", { type: "add" });
                                    console.log(response.data);
                                    vm.$refs["form"].resetFields();
                                    vm.$message({
                                        showClose: true,
                                        message: "Сведения о договоре добавлены",
                                        type: 'success'
                                    });
                                    vm.$emit("contract-save", {
                                        contract: response.data,
                                        needSpecification: vm.needSpecification,
                                        type: "add"
                                    });
                                } else {
                                    vm.$alert(response.data, 'Ошибка', {
                                        type: "error",
                                        confirmButtonText: 'OK',
                                    });
                                }
                            }
                        });
                    } else {
                        $.ajax({
                            url: "/fooContract/Update2/",
                            dataType: "json",
                            contentType: "application/json; charsert=utf-8",
                            method: "post",
                            data: JSON.stringify(vm.contract),
                            success: function (response) {
                                if (response.success) {
                                    vm.$message({
                                        showClose: true,
                                        message: "Сведения о договоре добавлены",
                                        type: 'success'
                                    });
                                    vm.$emit("contract-save", {
                                        contract: response.data,
                                        needSpecification: vm.needSpecification,
                                        type: "edit"
                                    });
                                } else {
                                    vm.$alert(data.message, 'Ошибка', {
                                        type: "error",
                                        confirmButtonText: 'OK',
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    },

    watch: {
        "contract.dates": function (value) {

            if (Array.isArray(value)) {
                value[0] = new Date(value[0]).toISOString();
                value[1] = new Date(value[1]).toISOString();
                this.contract.BeginDate = value[0];
                this.contract.EndDate = value[1];
            }

        },

        "contract.ContractDate": function (value) {
            var vm = this;
            this.contract.ContractDate = new Date(value).toISOString();
            var fields = ["BeginDate", "EndDate"].forEach(function (field) {
                vm.$refs.form.validateField(field);
            });


        },

        "contract.BeginDate": function (value) {
            var vm = this;
            this.contract.BeginDate = new Date(value).toISOString();
            this.contract.ContractDate = new Date(value).toISOString();
            var fields = ["ContractDate", "EndDate"].forEach(function (field) {
                vm.$refs.form.validateField(field);
            });
        },


        "contract.EndDate": function (value) {
            var vm = this;
            this.contract.EndDate = new Date(value).toISOString();
            var fields = ["ContractDate", "BeginDate"].forEach(function (field) {
                vm.$refs.form.validateField(field);
            });
        },

        "contract.CloseDate": function (value) {
            if (value !== null) {
                this.contract.CloseDate = new Date(value).toISOString();
            }
        },

        //"contract.IsVAT": function (value) {
        //    if (this.model.Details.length > 0) {
        //        //this.$alert('В договоре уже имеются данные о спецификации, '+
        //        //    'значения цены за единицу были пересчитаны автоматически, '+ 
        //        //    'однако настоятельно рекоментуется проверить правильность расчетов',
        //        //    'Внимание', {
        //        //        confirmButtonText: 'OK',
        //        //        type: "warning",

        //        //});
        //        if (value === 1 && this.model.Details) {

        //            var vm = this;
        //            this.model.Detail = this.model.Details.map(function (item) {
        //                $.ajax({
        //                    method: "post",
        //                    url: "/Food/GetFoodVAT/",
        //                    data: {
        //                        id: item.FoodID,
        //                        date: vm.model.ContractDate
        //                    },
        //                    success: function (data) {
        //                        item.VATRate = data.VatRate;
        //                        var sumWithoutWAT = item.Sum * ((100 - item.VATRate) / 100);
        //                        item.Price = sumWithoutWAT / item.Amount;
        //                        return item;
        //                    }
        //                });

        //            });

        //        }

        //        if (value === 2 && this.model.Details) {
        //            this.model.Details = this.model.Details.map(function (item) {

        //                item.Price = item.Sum / item.Amount;



        //                return item;
        //            });
        //        };
        //    }
        //},


        //"contract": function (value) {
        //    //if (!value) {
        //    //    this.model = this.generateNewModel();
        //    //} else {
        //    //    this.prepareContractToEdit(value);
        //    //}
        //},

        //"contract.ContractSum": function (value) {
        //    //if (("" + value).indexOf(",") > -1) {
        //    //    value = Number.parseFloat(("" + value).replace(",", "."));
        //    //    console.log(value);
        //    //    this.model.ContractSum = value;
        //    //    console.log(this.model.ContractSum);
        //    //}
        //}
    }
});