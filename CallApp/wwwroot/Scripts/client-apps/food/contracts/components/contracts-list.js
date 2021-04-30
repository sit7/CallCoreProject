Vue.component("contracts-list", {
    template: "#contracts-list",
    mixins: [crossdMixins],
    data: function () {
        return {
            //recipies: [],
            message: "Contracts list",
            year: Date.now(),
            //showAddContractDialog: false,
            contract: null,
            contractFormMode: "add",
            loading: false,
            counteragent: null,
            contracts: [],
            search: null,
            showContractDialog: false,
            showSpecificationDialog: false,
            showCloseContractDialog: false
        };
    },

    computed: {
        contractsList: function () {
            var vm = this;
           
            var result = vm.cloneData(vm.contracts);
            if (vm.$route.query.status === "active") {
                
                result = result.filter(function (item) {
                    return item.RecordStatusID === 1 && item.CloseDate === null;
                });
            }
            if (vm.$route.query.status === "closed") {
                
                result = result.filter(function (item) {
                    return item.CloseDate !== null;
                });
            }

            if (vm.$route.query.status === "template") {
                
                result = result.filter(function (item) {
                    return item.RecordStatusID === 3;
                });
            }
            if (vm.search !== null) {
                
                result = result.filter(function (item) {
                    
                    var contractNumber = item.ContractNumber !== null
                        ? item.ContractNumber.toLowerCase()
                        : "";
                    return contractNumber.indexOf(vm.search, 0) > -1;
                });
            }
            vm.loading = false;
            return result;
        },

        totalContracts: function () {
            return this.contracts.length;
        },

        activeContracts: function () {
            return this.contracts.filter(function (item) {
                return item.RecordStatusID === 1 && item.CloseDate === null;
            }).length;
        },

        closedContracts: function () {
            return this.contracts.filter(function (item) {
                return item.CloseDate !== null;
            }).length;
        },

        templateContracts: function () {
            return this.contracts.filter(function (item) {
                return item.RecordStatusID === 3;
            }).length;
        }
    },

    methods: {
        addContract: function () {
            this.contract = null;
            this.contractFormMode = "add";
            this.showAddContractDialog = true;
        },

        showAddContractDialogClosed: function (event) {
            
            
            this.showAddContractDialog = false;
            this.contract = null;
            this.contractFormMode = "add";
            if (event.type === "edit") {
                
                this.$store.dispatch("editContract", event.data);
            }
        },

        editContract: function (contract) {
            this.showAddContractDialog = true;
            vm = this;
            $.ajax({
                method: "get",
                url: "/fooContract/GetContract/" + contract.ContractID,
                success: function (data) {
                    vm.showAddContractDialog = true;
                    vm.contract = data;
                    vm.contractFormMode = "edit";
                }
            });
            
            
        },

        deleteContract: function (contract) {
            
            var vm = this;
            this.$confirm("Вы действительно хотите удалить этот договор", "Внимание", {
                confirmButtonText: 'Да',
                cancelButtonText: 'Нет',
                cancelButtonClass: "el-button--text",
                type: 'warning'
            }).then(function () {
                $.ajax({
                    url: "/fooContract/DeleteContract/",
                    dataType: "json",
                    contentType: "application/json; charsert=utf-8",
                    method: "post",
                    data: JSON.stringify({ id: contract.ContractID }),
                    success: function (response) {
                        if (response === true) {
                            contract.RecordStatusID = 2;
                            vm.$message({
                                type: 'danger',
                                message: 'Данные удалены'
                            });
                        }
                    }
                });

            });

        },

        useAsTemplate: function (contract) {
            
            var vm = this;
            $.ajax({
                method: "post",
                url: "/contracts/use-as-template",
                dataType: "json",
                contentType: "application/json; charsert=utf-8",
                data: JSON.stringify({ id: contract.ContractID }),
                success: function (response) {
                    if (response){
                        $.ajax({
                            method: "get",
                            url: "/contracts/contract-" + response,
                            success: function (data) {
                                vm.contracts.push(data);
                                vm.$message({
                                    type: 'success',
                                    message: 'Шаблон договора создан'
                                });
                            }
                        });
                    }
                }
            });
        },

        showSpecification: function (contract) {
            vm = this;
            $.ajax({
                method: "get",
                url: "/fooContract/GetContract/" + contract.ContractID,
                success: function (data) {
                    vm.showSpecificationDialog = true;
                    vm.contract = data;
                }
            });
            
        },

        hideSpecification: function () {
            
            this.contract = null,
            this.showSpecificationDialog = false;
        },
        
        renderHeader: function (h, item) {
            return h("span", ["Конечная", h("br"), "дата"]);
        },

        getCounteragent: function () {
            var vm = this;
            var date = new Date(vm.year).toISOString();
            $.ajax({
                method: "get",
                url: "/contracts/counteragent-" + vm.$route.params.counteragentId,
                data: { year: date},
                success: function (data, status, xhr) {
                    vm.counteragent = data;
                    vm.loading = true;
                    $.ajax({
                        method: "get",
                        url: "/contracts/counteragent-" + vm.$route.params.counteragentId + "/list",
                        data: { year: date },
                        success: function (result) {
                            vm.contracts = result;
                            vm.loading = false;
                        }
                    });
                }

            });
        },

        openContractDialog: function () {
            var vm = this;
            console.log("dialog");
            var endDate = new Date(new Date(Date.now()).getFullYear(), 11, 31);
            vm.contract = {
                ContractID: - vm.generateUid(),
                ContragentID: vm.counteragent.ContragentID,
                ContractNumber: null,
                Description: null,
                ContractDate: new Date(Date.now()).toISOString(),
                BeginDate: new Date(Date.now()).toISOString(),
                EndDate: endDate,//new Date(Date.now()).toISOString(),
                IsVAT: 2,
                RecordStatusID: 1,
                ContractSum: 0,
                BeginDateSum: 0,
                CloseDate: null,
                dates: [
                    new Date(Date.now()).toISOString(),
                    endDate//new Date(Date.now()).toISOString()
                ]
            };
            console.log(vm.contract);
            vm.showContractDialog = true;
        },

        onContractSave: function (data) {
            var vm = this;
            console.log(data);
            if (data.type === "add") {
                vm.contracts.push(data.contract);
            }
            if (data.type === "edit") {
                var contractIndex = vm.contracts.findIndex(function (item) {
                    return item.ContractID === data.contract.ContractID;
                });

                vm.$set(vm.contracts, contractIndex, data.contract);
            }

            vm.showContractDialog = false;
            if (data.needSpecification) {
                vm.contract = data.contract;
                console.log(vm.contract);
                vm.showSpecificationDialog = data.needSpecification;
            }
            
        },

        onEditContract: function (data) {
            var vm = this;
            console.log(data);
            data.BeginDate = vm.parseDate(data.BeginDate);
            data.ContractDate = vm.parseDate(data.ContractDate);
            data.EndDate = vm.parseDate(data.EndDate);
            data.CloseDate = data.CloseDate !== null
                ? vm.parseDate(data.CloseDate)
                : null;
            vm.contract = vm.cloneData(data);
            vm.showContractDialog = true;
        },

        onSpecificationEdit: function (data) {
            var vm = this;
            console.log(data);
            vm.contract = vm.cloneData(data);
            vm.showSpecificationDialog = true;
        },

        specificationChanged: function (data) {
            var vm = this;
            //console.log(data);
            //var contractIndex = vm.contracts.findIndex(function (item) {
            //    return item.ContractID = data.ContractID;
            //});
            //var contract = vm.contracts[contractIndex];

            //contract.Positions = data.Positions;
            //vm.$set(vm.contracts, contractIndex, contract);
            var date = new Date(vm.year).toISOString();
            vm.loading = true;
            $.ajax({
                method: "get",
                url: "/contracts/counteragent-" + vm.$route.params.counteragentId + "/list",
                data: { year: date },
                success: function (result) {
                    vm.contracts = result;
                    vm.loading = false;
                }
            });
        },

        onDeleteContract: function (contract) {
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
                    data: JSON.stringify({ id: contract.ContractID }),
                    success: function (data) {
                        vm.contracts = vm.contracts.filter(function (item) {
                            return item.ContractID !== contract.ContractID;
                        });
                        vm.$message({
                            type: 'error',
                            message: 'Договор удален'
                        });
                    }
                });
            });
        },

        onCloseContract: function (contract) {
            var vm = this;
            contract.BeginDate = vm.parseDate(contract.BeginDate);
            contract.ContractDate = vm.parseDate(contract.ContractDate);
            contract.EndDate = vm.parseDate(contract.EndDate);
            contract.CloseDate = contract.CloseDate !== null
                ? vm.parseDate(contract.CloseDate)
                : null;
            vm.contract = vm.cloneData(contract);
            //vm.contract.CloseDate = new Date(Date.now()).toISOString();
            
            vm.showCloseContractDialog = true;
        },

        onContractClosed: function (data) {
            var vm = this;
            if (data.type === "edit") {
                vm.showCloseContractDialog = false;
                var contractIndex = vm.contracts.findIndex(function (item) {
                    return item.ContractID === data.contract.ContractID;
                });

                //vm.contract.CloseDate = vm.parseDate(data.CloseDate);
                vm.$set(vm.contracts[contractIndex], "CloseDate" , data.contract.CloseDate);
                
            }
        },


        onCancelCloseContract: function (contract) {
            var vm = this;
            
            
            contract.BeginDate = vm.parseDate(contract.BeginDate);
            contract.ContractDate = vm.parseDate(contract.ContractDate);
            contract.EndDate = vm.parseDate(contract.EndDate);
            contract.CloseDate = contract.CloseDate !== null
                ? vm.parseDate(contract.CloseDate)
                : null;
            contract.CloseDate = null;
            $.ajax({
                url: "/fooContract/Update2/",
                dataType: "json",
                contentType: "application/json; charsert=utf-8",
                method: "post",
                data: JSON.stringify(contract),
                success: function (response) {

                    if (response.success) {
                        var contractIndex = vm.contracts.findIndex(function (item) {
                            return item.ContractID === response.data.ContractID;
                        });

                        vm.$set(vm.contracts[contractIndex], "CloseDate", response.data.CloseDate);
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
        }
    },

    watch: {
        year: function (value) {
            var date = new Date(value);

            //this.$store.dispatch("getContracts", { year: date.toISOString() });
            this.getCounteragent();
        }
    },

    //beforeRouteUpdate: function (to, from, next) {
    //    this.loading = true;
    //    next();
    //},

    created: function () {
        var date = new Date(Date.now()).toISOString();
        this.getCounteragent();
    }
});