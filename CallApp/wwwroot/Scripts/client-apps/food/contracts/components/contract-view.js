Vue.component("contract-view", {
    template: "#contract-view",
    mixins: [crossdMixins],
    data: function () {
        return {
            products: [],
            invoices: [],
            contract: null,
            contractToEdit: null,
            showContractDialog: false,
            showSpecificationDialog: false,
            showCloseContractDialog: false
        };
    },

    computed: {
        contractRemain: function () {
            return this.contract.ContractSum - this.contract.SpendSum;
        },

        contractExcecution: function () {
            var vm = this;
            var onePercent = vm.contract.ContractSum / 100;

            return this.contract.SpendSum / onePercent;
        },
    },

    methods: {
        getProducts: function () {
            console.log("getProducts");
            var vm = this;
            $.ajax({
                method: "get",
                url: "/fooContractDetail/GetContractDetails/" + vm.$route.params.contractId,
                success: function (data, status, xhr) {
                    if (data) {
                        console.log(data);
                        vm.products = data;
                    }
                }
            });

        },

        getInvoices: function () {
            console.log("getInvoices");
            var vm = this;
            $.ajax({
                method: "get",
                url: "/contracts/contract-" + vm.$route.params.contractId + "/invoices",
                success: function (data, status, xhr) {
                    if (data) {
                        console.log(data);
                        vm.invoices = data;
                    }
                }
            });
        },

        getContract: function () {
            var vm = this;
            $.ajax({
                method: "get",
                url: "/contracts/contract-" + vm.$route.params.contractId,
                success: function (data, status, xhr) {
                    if (data) {
                        vm.contract = data;
                    }
                }
            });
        },

        handleCommand: function (command) {
            console.log(command);
            //this.$emit(command.name, this.contract);
            var methodName = command.name.split('-').map(function (item, index) {
                if (index > 0) {
                    var firstLetter = item[0].toUpperCase();
                    var otherLetters = item.substring(1);
                    return firstLetter + otherLetters;
                }
                return item;
            }).join('');
            this[methodName](command.params);
            //console.log(methodName);
        },

        showAddContractDialogClosed: function (data) {
        },

        onContractSave: function (data) {
            console.log(data);
            this.getContract();
            this.showContractDialog = false;
            this.showSpecificationDialog = data.needSpecification;
        },

        contractEdit: function (data) {
            var vm = this;
            
            vm.contract.BeginDate = vm.parseDate(vm.contract.BeginDate);
            vm.contract.ContractDate = vm.parseDate(vm.contract.ContractDate);
            vm.contract.EndDate = vm.parseDate(vm.contract.EndDate);
            vm.contract.CloseDate = vm.contract.CloseDate !== null
                ? vm.parseDate(vm.contract.CloseDate)
                : null;
            vm.contractToEdit = vm.cloneData(vm.contract);
            vm.showContractDialog = true;

        },

        specificationEdit: function (data) {
            var vm = this;
            vm.showSpecificationDialog = true;
        },

        specificationChanged: function (data) {
            var vm = this;
            console.log(data);
            vm.getProducts();
        },

        contractTemplate: function () {
            var vm = this;
            $.ajax({
                method: "post",
                url: "/contracts/use-as-template",
                dataType: "json",
                contentType: "application/json; charsert=utf-8",
                data: JSON.stringify({ id: vm.contract.ContractID }),
                success: function (response) {
                    vm.$confirm('Шаблон договора успешно создан, перейти', 'Шаблон создан', {
                        confirmButtonText: 'Да',
                        cancelButtonText: 'Нет',
                        type: 'warning'
                    }).then(() => {
                        //this.$message({
                        //    type: 'success',
                        //    message: 'Delete completed'
                        //});
                        vm.$router.push({ name: "contract", params: { contractId: response } });
                    });
                    //if (response) {
                    //    $.ajax({
                    //        method: "get",
                    //        url: "/contracts/contract-" + response,
                    //        success: function (data) {
                                
                    //            vm.$message({
                    //                type: 'success',
                    //                message: 'Шаблон договора создан'
                    //            });
                    //        }
                    //    });
                    //}
                }
            });
        },

        contractClose: function (data) {
            var vm = this;

            vm.contract.BeginDate = vm.parseDate(vm.contract.BeginDate);
            vm.contract.ContractDate = vm.parseDate(vm.contract.ContractDate);
            vm.contract.EndDate = vm.parseDate(vm.contract.EndDate);
            vm.contract.CloseDate = vm.contract.CloseDate !== null
                ? vm.parseDate(vm.contract.CloseDate)
                : null;
            vm.contractToEdit = vm.cloneData(vm.contract);
            vm.showCloseContractDialog = true;
        },

        contractCancelClose: function (data) {
            var vm = this;
            vm.contract.BeginDate = vm.parseDate(vm.contract.BeginDate);
            vm.contract.ContractDate = vm.parseDate(vm.contract.ContractDate);
            vm.contract.EndDate = vm.parseDate(vm.contract.EndDate);
            vm.contract.CloseDate = vm.contract.CloseDate !== null
                ? vm.parseDate(vm.contract.CloseDate)
                : null;
            vm.contract.CloseDate = null;
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
                            message: "Закрытие договора отменено",
                            type: 'warning'
                        });
                    } else {
                        vm.$alert(response.data, 'Ошибка', {
                            type: "error",
                            confirmButtonText: 'OK',
                        });
                    }
                }
            });
        },

        onContractClosed: function (data) {
            var vm = this;
            vm.contract.CloseDate = data.contract.CloseDate;
            vm.showCloseContractDialog = false;
        },

        contractDelete: function (data) {
            var vm = this;

            vm.$confirm('Вы действительно хотите удалить договор', 'Внимание', {
                confirmButtonText: 'Да',
                cancelButtonText: 'Нет',
                type: 'warning'
            }).then(function () {

                $.ajax({
                    method: "post",
                    url: "/fooContract/DeleteContract",
                    dataType: "json",
                    contentType: "application/json; charsert=utf-8",
                    data: JSON.stringify({ id: vm.contract.ContractID }),
                    success: function (data) {

                        vm.$message({
                            type: 'error',
                            message: 'Договор удален'
                        });

                        vm.$router.replace({ name: "contracts", params: { counteragentId: vm.contract.ContragentID }});
                    }
                });
            });
        }

    },

    watch: {
        "$route": function () {
            var vm = this;
            vm.getInvoices();
            vm.getProducts();
            vm.getContract();
        }
    },

    created: function () {
        var vm = this;
        vm.getContract();
        vm.getInvoices();
        vm.getProducts();
    }
});