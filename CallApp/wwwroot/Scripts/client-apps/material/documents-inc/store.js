var store = new Vuex.Store({
    state: {
        searchString : "",
         foods: [],

    },

    getters: {
        searchString: function (state) {
            return state.searchString;
        },

 
        foods: function (state, getters) {
            return state.foods;
        },

     },

    actions: {
        setSearchString: function (context, string) {
            context.commit("modifySearchString", string);
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


    },

    mutations: {
        modifySearchString: function (state, string) {
            state.searchString = string
        },

         
        modifyFoods: function (state, data) {
            state.foods = data;
        },

 
    }
});