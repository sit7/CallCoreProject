var store = new Vuex.Store({
    state: {
        searchString : "",
        recipies: [],
        recipe: {},
        recipeElements: [],
        cookBooks: [],
        recipeSources: [],
        foods: [],

        techCardGroups:[]
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


        techCardModel: function (state) {
            return {
                recipe: state.recipe,
                recipeElements: state.recipeElements
            }
        },

        cookBooks: function (state) {
            return state.cookBooks;
        },

        recipeSources: function (state, getters) {
            return state.recipeSources;
        },

        recipeContent: function (state) {
            return state.recipe.recipeContent.filter(function (item) {
                if (item.RecordStatusID === 1) {
                    return item;
                }
            });
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

        techCardGroups: function (state, getters) {
            return state.techCardGroups;
        },

        getTechCardGroupName: function (state, getters) {
            return function (id) {
                return state.techCardGroups.find(function (item) {
                    return item.TechCardGroupID === id;
                })
            }
        }
    },

    actions: {
        setSearchString: function (context, string) {
            context.commit("modifySearchString", string);
        },

        

        getRecipe: function (context, id) {
            $.ajax({
                method: "get",
                url: "/fooRecipe/getRecipeContents2/" + id,
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
        },

        addRecipeProduct: function (context, data) {
            context.commit("modifyRecipeProducts", { product: data, mode: "add" })
        },

        editRecipeProduct: function (context, data) {
            context.commit("modifyRecipeProducts", { product: data, mode: "edit" })
        },

        removeRecipeProduct: function (context, product) {
            context.commit("modifyRecipeProducts", { product: product, mode: "remove"});
        },

        cancelRemoveRecipeProduct: function (context, product) {
            context.commit("modifyRecipeProducts", { product: product, mode: "cancelRemove" });
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

        recipeContentRefresh: function (context) {
            context.commit("modifyRecipeContent");
        },

        setTechCardGroups: function (context, data) {
            context.commit("modifyTechCardGroups", data);
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
        },

        modifyRecipeProducts: function (state, data) {
            if (data.mode === "remove") {
                state.recipe.recipeContent.find(function (product, index) {
                    if (product.FoodRecipeID === data.product.FoodRecipeID) {
                        if (product.FoodRecipeID > 0) {
                            product.RecordStatusID = 2;
                            return product;
                        } else {
                            state.recipe.recipeContent.splice(index, 1);
                            return;
                        }
                    }
                });
                
            }

            if (data.mode === "cancelRemove") {
                state.recipe.recipeContent.find(function (product) {
                    if (product.FoodRecipeID === data.product.FoodRecipeID) {
                        product.RecordStatusID = 1;
                    }
                });
            }

            if (data.mode === "add") {
                state.recipe.recipeContent.push(data.product);
            }

            if (data.mode === "edit") {
                state.recipe.recipeContent = state.recipe.recipeContent.map(function (product, index) {
                    if (product.FoodRecipeID === data.product.FoodRecipeID) {
                        console.log(data.product)
                        return data.product;
                    }
                    return product;
                });
            }
        },

        modifyFoods: function (state, data) {
            state.foods = data;
        },

        modifyRecipeContent: function (state) {
            var content = JSON.parse(JSON.stringify(state.recipe.recipeContent));
            state.recipe.recipeContent = [];
            state.recipe.recipeContent = content;
            console.log(state.recipe.recipeContent);
        },

        modifyTechCardGroups: function (state, data) {
            state.techCardGroups = data;
        }
    }
});