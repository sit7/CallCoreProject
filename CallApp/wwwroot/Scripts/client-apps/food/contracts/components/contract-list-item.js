Vue.component("contract-list-item", {
    template: "#contract-list-item",
    data: function () {
        return {
            //recipies: [],
            showProducts: false,
            showInvoices: false,
            invoices: [],
            products: []
        };
    },

    props: {
        contract: Object
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

        statusClass: function () {
            var vm = this;
            return {
                "is-active": vm.contract.CloseDate === null && vm.contract.RecordStatusID === 1,
                "is-close": vm.contract.CloseDate !== null && vm.contract.RecordStatusID === 1,
            };
        }
    },

    methods: {
        handleShowProducts: function (value) {
            var vm = this;
           
            if (value > 0) {
                $.ajax({
                    method: "get",
                    url: "/fooContractDetail/GetContractDetails/" + vm.contract.ContractID,
                    success: function (data, status, xhr) {
                        vm.showProducts = true;
                        vm.products = data;
                    }
                });
            }
        },

        handleShowInvoices: function (value) {
            var vm = this;
            console.log(value);
            if (value > 0) {
                $.ajax({
                    method: "get",
                    url: "/contracts/contract-" + vm.contract.ContractID + "/invoices",
                    success: function (data, status, xhr) {
                        if (data) {
                            vm.showInvoices = true;
                            vm.invoices = data;
                        }
                    }
                });
            }
           
        },

        hasItemsClass: function (value) {
            return {
                "has-items": value > 0 
            };
        },

        handleCommand: function (command) {
            
            console.log(command);
            console.log(this);
            this.$emit(command.name, this.contract);
            
        },

        commandName: function (params) {
            console.log(params);
        }

    },

    created: function () {
        
    }
    
});