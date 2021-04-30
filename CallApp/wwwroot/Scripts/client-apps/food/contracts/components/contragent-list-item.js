Vue.component("contragent-list-item", {
    template: "#contragent-list-item",
    data: function () {
        return {

        };
    },
    props: {
        contragent: Object
    },

    computed: {
        activeContracts: function () {
            var vm = this;
            return vm.contragent.contracts.filter(function (item, index) {
                return item.CloseDate === null;
            });
        },

        closedContracts: function () {
            var vm = this;
            return vm.contragent.contracts.filter(function (item, index) {
                return item.CloseDate !== null;
            });
        }
    },

    methods: {
        handleCommand: function (command) {
            this.$router.push({
                name: 'contract',
                params: { counteragentId: this.contragent.ContragentID, contractId: command }
            });
        }
    },



    created: function () {
        
    }
});