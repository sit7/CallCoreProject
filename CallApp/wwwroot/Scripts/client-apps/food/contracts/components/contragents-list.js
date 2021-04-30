Vue.component("contragents-list", {
    template: "#contragents-list",
    //mixins: [crossdMixins],
    data: function () {
        return {
            
            message: "Contracts list",
            contragents:[]
        };
    },

    methods: {
        getContragetns: function () {
            var vm = this;
            $.ajax({
                method: "get",
                url: "/contracts/contragents/list",
                success: function (data, status, xhr) {
                    //var result = JSON.parse(data, function (key, value) {
                    //    if (key === "ContractDate" || key === "CloseDate") {
                    //        return (value);
                    //    }
                    //    return value;
                    //});
                    vm.contragents = data;
                }
            });
        }
    },

    created: function () {
        this.getContragetns();
    }
});