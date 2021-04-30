var store = new Vuex.Store({
    state: {
        searchString : "",
        recipies: [],
        recipe: {},
        recipeElements: [],
        cookBooks: [],
        recipeSources: []
    },

    getters: {
        searchString: function (state) {
            return state.searchString;
        },

        recipies: function (state) {
            return state.recipies;
        },

        recipe: function(state){
            return state.recipe;
        },

        recipeElements: function (state) {
            return state.recipeElements;
        },

        cookBooks: function (state) {
            return state.cookBooks;
        },

        recipeSources: function (state, getters) {
            return state.recipeSources;
        }
    },

    actions: {
        setSearchString: function (context, string) {
            context.commit("modifySearchString", string);
        },

        getRecipies: function (context, params) {
            
            var data = [];
            if (params.searchBy === "articleId") {
                
                $.ajax({
                    mthod: "get",
                    url: "/fooRecipe/GetCookBookArticleRecepies/" + params.id,

                    success: function (data) {
                        context.commit("modifyRecipies", data);
                    }
                });
            }
            if (params.searchBy === "name") {
                $.ajax({
                    mthod: "get",
                    url: "/fooRecipe/SearchRecipiesInCookBook/",
                    data: {
                        cookBookId: params.id,
                        searchString: params.searchString
                    },
                    success: function (data) {
                        context.commit("modifyRecipies", data);
                    }
                });
            }
            
        },

        getRecipe: function (context, id) {
            $.ajax({
                method: "get",
                url: "/fooRecipe/getRecipeContents/" + id,
                success: function (data) {
                    context.commit("modifyRecipe", data);
                }
            });
        },

        getRecipeElements: function (context, id) {
            $.ajax({
                method: "get",
                url: "/fooRecipe/GetRecipeElements/" + id,
                success: function (data) {
                    context.commit("modifyRecipeElements", data);
                }
            });
        },

        getCookBooks: function (context) {
            $.ajax({
                method: "get",
                url: "/fooRecipe/GetCookBooks",
                success: function (data) {
                    //context.commit("modifyCookBooks", data);
                }
            }).then(function (data) { context.commit("modifyCookBooks", data); });
        },

        getRecipeSources: function (context) {
            $.ajax({
                method: "get",
                url: "/fooRecipe/GetRecipeSources",
                success: function (data) {
                    context.commit("modifyRecipeSources", data);
                }
            });
        }
    },

    mutations: {
        modifySearchString: function (state, string) {
            state.searchString = string
        },

        modifyRecipies: function (state, data) {
            state.recipies = data;
        },

        modifyRecipe: function (state, data) {
            var recipeText = data.recipeText[0];
            data.recipeText = recipeText;
            state.recipe = data;
        },

        modifyRecipeElements: function (state, data) {
            state.recipeElements = data;
        },

        modifyCookBooks: function (state, data) {
            state.cookBooks = data;
        },

        modifyRecipeSources: function (state, data) {
            state.recipeSources = data;
        }
    }
});