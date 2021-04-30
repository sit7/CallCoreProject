Vue.component("technology-card-view", {
    template: "#technology-card-view",
    props: [
       "cardId"
    ],
    data: function () {
        return {
            tabs: [
                {
                    id: 1,
                    name: "Энергетическая ценность",
                    code: "energy"
                },
                {
                    id: 2,
                    name: "Витамины",
                    code: "vitamins"
                },
                {
                    id: 3,
                    name: "Минералы",
                    code: "minerals"
                }
            ],
            activeTab: "energy",
            showEditRecipeDialog: false,
            recipe: {},
            recipeFormMode: "edit"
        };
    },

    computed: {
        techCardReportLink: function () {
            //window.location.assign("/Food/TechnologyCardReport/" + this.recipe.RecipeID, '_blank');
            //window.open(location.host + "/Food/TechnologyCardReport/" + this.recipe.RecipeID, '_blank');
            return "/Food/TechnologyCardReport/" + this.recipe.RecipeID;
        },
        
        isArciveClass: function () {
            return {
                "is-archive": this.recipe.IsArchive > 0,
                "is-active": this.recipe.IsArchive === 0
            }
        },
    },

    methods: {
        editRecipe: function () {
            this.recipeFormMode = "edit";
            this.showEditRecipeDialog = true;
        },

        useRecipeAsTemplate: function () {
            this.recipeFormMode = "create";
            this.showEditRecipeDialog = true;
        },

        loadRecipe: function () {
            var cardId = this.$route.params.cardId;
            var vm = this;
            $.ajax({
                method: "get",
                dataType: "json",
                contentType: "application/json, charsert=utf-8",
                url: "/fooRecipe/GetRecipeContents2/" + cardId,
                success: function (responce) {
                    
                    var recipe =JSON.parse(responce);
                    console.log(recipe);
                    var foodCalculationInputs = recipe.Foods.map(function (item) {
                        
                        return {
                            FoodID: item.FoodID,
                            FoodRecipeID: item.FoodRecipeID,
                            Netto: item.Netto,
                            PercentValue: item.PercentValue,
                            IsBoilLoss:item.IsBoilLoss
                        }
                    });


                    $.ajax({
                        method:"post",
                        url: "/fooRecipe/FoodCalculator",
                        dataType: "json",
                        contentType: "application/json, charsert=utf-8",
                        data: JSON.stringify({ foods: foodCalculationInputs }),
                        success: function (calculations) {
                            console.log(calculations);
                            recipe.Foods.forEach(function (food) {
                                food.Losses = calculations.find(function (calc) {
                                    return calc.FoodRecipeID === food.FoodRecipeID
                                }).Losses;
                            });
                            vm.recipe = recipe;
                            console.log(vm.recipe);
                        }
                    })
                }
            });
        },

        loadTechCardGroups: function () {
            var vm = this;
            $.ajax({
                method: "get",
                //data: { date: new Date(vm.menuDate).toISOString() },
                url: "/fooRecipe/GetTechCardGroups",
                success: function (responce) {
                    //vm.techCardGroups = responce; 
                    vm.$store.dispatch("setTechCardGroups", responce);
                }
            });
        },

        moveToCategory: function (recipeID, techCardGroupID) {
            var vm = this;
            $.ajax({
                method: "post",
                url: "/fooRecipe/MoveRecipeToCategory",
                data: { recipeID: recipeID, techCardGroupID: techCardGroupID },
                success: function (response) {
                    if (response) {
                        vm.recipe.TechCardGroupID = techCardGroupID;
                        vm.$emit("tech-card-group-changed");
                        vm.$message({
                            message: "Технологическая карта " + vm.recipe.Name + " успешно перемещена",
                            type: 'success'
                        });
                    }
                }
            });
        },

        goToCategory: function (event, categoryId) {
            
            //var historyRoute = this.$router.history.router.history.current;
            //console.log(historyRoute.query);
            //if (historyRoute.query.page) {
                
            //    this.$router.go(-1);
            //}

            this.$router.go(-1);
            //this.$router.replace({ name: "recipeCategory", params: { categoryId: categoryId } });
        },
        

        goToCategories: function () {
            this.$router.replace({ path: "/" });
        },

        onRecipeSaved: function (event) {
            console.log(event);
            var vm = this;
            this.showEditRecipeDialog = false;
            if (event.recipe.RecipeID === event.newRecipeID) {
                vm.loadRecipe();
                vm.$message({
                    showClose: true,
                    type: "success",
                    message: 'Изменения в технологической карте были успешно сохранены'
                });
            } else if (event.recipe.RecipeID !== event.newRecipeID && event.mode==="edit") {
                this.$confirm('Технологическая карта уже использовалась в плане меню и/или была изменена закладка продуктов. '
                    +'Была создана новая технологическая карта. Перейти к ней?',
                    'Внимание', {
                    confirmButtonText: 'Да',
                    cancelButtonText: 'Нет',
                    type: 'warning'
                }).then(function() {
                    vm.$router.push({ name: "techCardView", params: {cardId: event.newRecipeID} })
                }).catch(function() {
                   
                });
            } else if (event.recipe.RecipeID !== event.newRecipeID && event.mode === "create") {
                this.$confirm('Новая технологическая карта была успешно создана.'
                    + 'Перейти к ней?',
                    'Внимание', {
                        confirmButtonText: 'Да',
                        cancelButtonText: 'Нет',
                        type: 'success'
                    }).then(function() {
                        vm.$router.push({ name: "techCardView", params: { cardId: event.newRecipeID } })
                    }).catch(function() {

                    })
                    .finally(function () { location.reload() });
            }
        },

        moveToArchive: function (recipe) {
            var vm = this;
            $.ajax({
                method: "post",
                url: "/fooRecipe/SetRecipeArchiveState",
                data: { recipeID: recipe.RecipeID },
                success: function (response) {
                    if (response) {
                        vm.recipe.IsArchive = vm.recipe.IsArchive === 1 ? 0 : 1;
                        vm.$message({
                            message: "Технологическая карта " + vm.recipe.Name + " перемещена в архив",
                            type: 'warning'
                        });
                    }
                }
            });
        }
    },

    filters: {


        nodata: function (value, replaceText) {
            if (value) {
                return value;
            } else if (replaceText) {
                return replaceText;
            }
            return "не указано"


        }
    },

    beforeMount: function () {
        this.loadRecipe();
        this.loadTechCardGroups();
    },

    created: function () {
        //var cardId = this.$route.params.cardId;
        console.log(this.$router);
        //this.$store.dispatch("getRecipeSources");
        //this.$store.dispatch("getRecipe", cardId);

        
    }
});