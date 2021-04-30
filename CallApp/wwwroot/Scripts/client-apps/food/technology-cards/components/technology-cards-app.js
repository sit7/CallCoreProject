Vue.component("technology-cards-app", {
    template: "#technology-cards-app",
    data: function () {
        return {
            recipies: [],
            searchString: '',
            searchResult: [],
            menuDate: Date.now(),
            isArchive: 0,
            menuDates: {},
            showAddRecipeDialog: false,
            recipe: {},
        }
    },

    computed: {


        isSearchStarted: function () {
            return this.searchString.length >= 3; 
        },
        
        techCardGroups: function () {
            var recipies = this.recipies;
            return this.$store.getters.techCardGroups.map(function (item, index) {
                item.Recipies = recipies.filter(function (recipe) { return recipe.TechCardGroupID === item.TechCardGroupID });
                return item;
            });
        }
    },

    methods: {
        changed: function (e) {
            this.$store.commit("modifyRecipies", [])
        },
        
        countCardContainerSpan: function (index) {
            var vm = this;

            if (index === vm.techCardGroups.length - 1) {

                return (3- (vm.techCardGroups.length - 1) % 3) * 8;
            }
            return 8;
        },

        techCardGroupChanged: function () {
            console.log("Group changed");
            this.getRecipiesByMenuDate(this.menuDate);
        },

        findRecipe: function (value, isArchive) {
            var vm = this;
            $.ajax({
                method: "get",
                url: "/fooRecipe/SearchRecipiesByName",
                data: { searchString: value, isAchive: this.isArchive },
                success: function (response) {
                    vm.searchResult = response;
                }
            });
        },
        
        getRecipiesByMenuDate: function (date) {
            var vm = this;
            $.ajax({
                method: "get",
                data: { date: new Date(date).toISOString() },
                url: "/fooRecipe/GetRecipiesByMenuDate",
                success: function (responce) {
                    vm.recipies = responce;
                }
            });
        },

        disableDates: function (date) {
            var momentDate = moment(date).format("DD.MM.YYYY");
            return this.menuDates[momentDate] === undefined;
        },
        
        addRecipe: function () {
            this.showAddRecipeDialog = true;
        },
        
        loadRecipe: function () {
            var cardId = 22;
            var vm = this;
            $.ajax({
                method: "get",
                dataType: "json",
                contentType: "application/json, charset=utf-8",
                url: "/fooRecipe/GetRecipeContents2/" + cardId,
                success: function (responce) {

                    var recipe = JSON.parse(responce);
                    recipe.RecordStatusID = 1;
                    recipe.Name = null;
                    var foodCalculationInputs = recipe.Foods.map(function (item) {

                        return {
                            FoodID: item.FoodID,
                            FoodRecipeID: item.FoodRecipeID,
                            Netto: item.Netto,
                            PercentValue: item.PercentValue,
                            IsBoilLoss: item.IsBoilLoss
                        }
                    });


                    $.ajax({
                        method: "post",
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


        onRecipeSaved: function (event) {
            var vm = this;
            vm.showAddRecipeDialog = false;
            vm.$message({
                showClose: true,
                message: 'Технологическая карта '+ event.recipe.Name + ' сохранена.',
                type: 'success'
            });
        }
    },

    watch: {

        "searchString": function (value) {
            var vm = this;
            if (this.isSearchStarted) {
                clearTimeout(vm.findRecipe);
                setTimeout(vm.findRecipe, 300, value);
            }
        },
        
        isArchive: function (value) {
            var vm = this;
            if (this.isSearchStarted) {
                vm.findRecipe(vm.searchString, value);
            }
        },

        "menuDate": function (value) {
            this.getRecipiesByMenuDate(value);
        }
    },




    created: function () {
        var store = this.$store;
        var vm = this;
        //store.dispatch("getCookBooks");
        $.ajax({
            method: "get",
            //data: { date: new Date(vm.menuDate).toISOString() },
            url: "/fooRecipe/GetTechCardGroups",
            success: function (responce) {
                //vm.techCardGroups = responce; 
                vm.$store.dispatch("setTechCardGroups", responce);
            }
        });
        vm.getRecipiesByMenuDate(vm.menuDate);
        $.ajax({
            method: "get",
            url: "/fooRecipe/GetObjectMenuDates",
            success: function (responce) {
                responce.forEach(function (item, index) {
                    var date = moment(item);
                    vm.menuDates[date.format("DD.MM.YYYY")] = date;
                });
            }
        });
        vm.loadRecipe();

    }
});