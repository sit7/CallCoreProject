var store = new Vuex.Store({
    state: {
        contracts: [],
        contractsIsLoading: false,
        contragents: [],
        foods: [],
        unitMeasures: []
    },

    getters: {
        searchString: function (state) {
            return state.searchString;
        },

        //contracts: function (state, getters) {
        //    var result = state.contracts.filter(function (contract) {
        //        return contract.RecordStatusID === 1;
        //    });

        //    if (getters.searchString) {
        //        result = result.filter(function (contract) {
        //            return contract.Name.toLowerCase().includes(getters.searchString.toLowerCase());
        //        });
        //    }

        //    return result;
        //},

        contractsIsLoading: function (state) {
            return state.contractsIsLoading;
        },


        contragents: function (state, getters) {
            return state.contragents;
        },

        foods: function (state, getters) {
            return state.foods;
        },

        getFoodById: function (state, getters) {
            return function (id) {
                return state.foods.find(function (item) {
                    if (item.FoodID === id) {
                        return item;
                    }
                })
            };
            
        },

        unitMeasures: function (state, getters) {
            return state.unitMeasures;
        },
    },

    actions: {
        setSearchString: function (context, string) {
            context.commit("modifySearchString", string);
        },

        getContracts: function (context, params) {
            context.commit("modifyContractsIsLoading", true);
            $.ajax({
                method: "get",
                url: "/fooContract/GetContracts2/",
                data: params,
                success: function (data) {
                    context.commit("modifyContracts", data);
                    context.commit("modifyContractsIsLoading", false);
                }
            });
        },

        getContragents: function (context) {
            //context.commit("modifyContractsIsLoading", true);
            $.ajax({
                method: "get",
                url: "/glbContragent/GetContragents/",
                //data: params,
                success: function (data) {
                    context.commit("modifyContragents", data);
                    //context.commit("modifyContractsIsLoading", false);
                }
            });
        },

        getFoods: function (context, query) {

            if (query.searchString || query.foodIds) {
                $.ajax({
                    method: "post",
                    url: "/Food/GetFoodData/",
                    data: query,
                    success: function (data) {
                        context.commit("modifyFoods", data);
                    }
                });
            }
        },

        getUnitMeasures: function (context) {
            $.ajax({
                method: "get",
                url: "/Food/GetUnitMeasures",
                success: function (data) {
                    context.commit("modifyUnitMeasures", data);
                }
            });
        },

        addContract: function (context, contract) {
            context.commit("modifyContractsAdd", contract);
        },

        editContract: function (context, contract) {
            context.commit("modifyContractsEdit", contract);
        }
    },

    mutations: {
        modifySearchString: function (state, string) {
            state.searchString = string
        },

        modifyContracts: function (state, data) {
            state.contracts = data;
        },

        modifyContractsAdd: function (state, data) {
            state.contracts.push(data);
            state.contracts.sort(function (a, b) {
                aContractDate = new Date(a.ContractDate);
                bContractDate = new Date(b.ContractDate);
                if (aContractDate < bContractDate) {
                    return 1;
                }

                if (aContractDate > bContractDate) {
                    return -1;
                }

                return 0;
            });
        },

        modifyContractsEdit: function (state, data) {
            
            //var position = state.contracts.find(function (item, index) {
            //    if (item.ContractID === data.ContractID) {
                     
                     
            //         return index;
            //     }
            //});

            var contracts = state.contracts.map(function (item, index) {
                if (item.ContractID === data.ContractID) {
                    item = data;
                }
                return item;
            })
            item = data;
            console.log(item);
            state.contracts = contracts;
        },

        modifyContractsIsLoading: function (state, data) {
            state.contractsIsLoading = data;
        },

        modifyContragents: function (state, data) {
            state.contragents = data;
        },

        modifyFoods: function (state, data) {
            state.foods = data;
        },

        modifyUnitMeasures: function (state, data) {
            state.unitMeasures = data;
        }
    }
});