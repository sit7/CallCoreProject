Vue.component("close-contract-form", {
    template: "#close-contract-form",
    mixins: [crossdMixins],
    data: function () {
        return {
            model: {
                closeDate: Date.now()
            }
        };
    },
    props: {
        contract: Object,
    },

    computed: {
        dateTimePickerOptions: function() {
            var vm = this;
            return {
                firstDayOfWeek: 1,
                //disabledDate: function (time) {
                //    console.log(time);
                //    var contractDate = new Date(vm.contractBeginDateISO);
                //    console.log(contractDate);
                //    return new Date(time) < contractDate;
                //}
            };
        },

        contractBeginDateISO: function () {
            return moment(this.contract.BeginDate).toISOString();
        }
    },

    methods: {
        closeContract: function () {
            var vm = this;
            console.log("closeContract");
            vm.$refs["form"].validate(function (valid, data) {
                if (valid) {
                    vm.contract.CloseDate = new Date(vm.model.closeDate).toISOString();
                    $.ajax({
                        url: "/fooContract/Update2/",
                        dataType: "json",
                        contentType: "application/json; charsert=utf-8",
                        method: "post",
                        data: JSON.stringify(vm.contract),
                        success: function (response) {

                            if (response.success) {
                                console.log(response.data);

                                vm.$message({
                                    showClose: true,
                                    message: "Договор закрыт",
                                    type: 'success'
                                });
                                vm.$emit("contract-closed", {
                                    contract: response.data,
                                    
                                    type: "edit"
                                });
                                vm.$refs.form.resetFields();
                            } else {
                                vm.$alert(data.message, 'Ошибка', {
                                    type: "error",
                                    confirmButtonText: 'OK',
                                });
                            }
                        }
                    });
                }
            });
        },

        closeDateValidator: function (rule, value, callback) {
            var vm = this;
            var contractDate = new Date(vm.contract.ContractDate);
            var beginDate = new Date(vm.contract.BeginDate);
            var endDate = new Date(vm.contract.EndDate);
            var closeDate = new Date(value);
            console.log(contractDate);
            console.log(beginDate);
            console.log(endDate);
            console.log(closeDate);
            if (closeDate === null) {
                callback();
            }
            if (closeDate < beginDate) {
                callback(new Error("Дата закрытия договора не может быть меньше даты начала действия"));
            }

            if (closeDate < contractDate) {
                callback(new Error("Дата закрытия договора не может быть меньше даты заключения действия"));
            }
            callback();
        }
    },

    watch: {
        "contract": function (value) {
            var vm = this;
            if (value.CloseDate === null) {
                vm.model.closeDate = Date.now();
            } else {
                vm.model.closeDate = value.CloseDate;
            }
            vm.$refs.form.resetFields();
        }
    },

    created: function () {
        var vm = this;
        if (vm.contract.CloseDate === null) {
            vm.model.closeDate = Date.now();
        } else {
            vm.model.closeDate = vm.contract.CloseDate;
        }

        
    }
});