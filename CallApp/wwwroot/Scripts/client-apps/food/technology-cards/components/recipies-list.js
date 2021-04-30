Vue.component("recipies-list", {
    template: "#recipies-list",
    mixins: [crossdMixins],
    data: function () {
        return {
            recipies: [],
            category: {
                Name: ''
            },
            
            searchString: '',
            isArchive: 0,
            showAddRecipeDialog: false,
            recipe: {}
        };
    },
    props: {
        categoryId: Number,
    },

        
    

    computed:{
        showRecipies: function () {
            var vm = this;
            return this.filterRecipies.slice((this.currentPage * 10) - 10, (this.currentPage * 10));
        },

        filterRecipies: function () {
            var vm = this;
            return this.recipies.filter(function (item, index) {
                return item.RecordStatusID !== 2
                       && (item.TechCardGroupID === vm.category.TechCardGroupID)
                       && (vm.isAchive === 0
                           ? item.isAchive === 0
                           : true);
            });
        },

        currentPage: function () {
            return +this.$route.query.page || 1;
        },
        
        techCardGroups: function () {
            var vm = this;
            if (vm.$store.getters.techCardGroups.length === 0) {
                $.ajax({
                    method: "get",
                    //data: { date: new Date(vm.menuDate).toISOString() },
                    url: "/fooRecipe/GetTechCardGroups",
                    success: function (responce) {
                        //vm.techCardGroups = responce;
                        vm.$store.dispatch("setTechCardGroups", responce);
                    }
                });
            }
            return vm.$store.getters.techCardGroups;
        },
        
        techCardGroupsToAdd: function () {
            var vm = this;
            return vm.$store.getters.techCardGroups.filter(function (item) {
                return item.TechCardGroupID === Number.parseInt(vm.$route.params.categoryId);
            });
        }

    },

    methods: {
        handlePageChange: function (page) {
            //var startIndex = (page * 10) - 10;
            //console.log(startIndex);


            this.$router.replace({ query: { page: page } });
        },
        
        goToCategories: function () {
            this.$router.push({path:"/"});
        },

        fetchTechCards: function (toFirstPage) {
            var vm = this;
            var data = {
                groupId: vm.$route.params.categoryId,
                searchString: vm.searchString.trim(),
                isAchive: vm.isArchive
            }

            $.ajax({
                method: "get",
                url: "/fooRecipe/GetTechCardByGroup",
                data: data,
                success: function (responce) {
                    vm.recipies = responce.recipies;
                    vm.category = responce.group;
                    if (toFirstPage) {
                        vm.$router.replace({ query: null });
                    }
                    //vm.$router.replace({ query: null });
                }
            });
        },

        addTechCard: function () {
            var cardId = 22;
            var vm = this;
            $.ajax({
                method: "get",
                dataType: "json",
                contentType: "application/json, charsert=utf-8",
                url: "/fooRecipe/GetRecipeContents2/" + cardId,
                success: function (responce) {

                    var recipe = JSON.parse(responce);
                    recipe.RecordStatusID = 1;
                    recipe.Name = null;
                    recipe.TechCardGroupID = Number.parseInt(vm.$route.params.categoryId);
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
                    vm.showAddRecipeDialog = true;
                }
            });
        },

        onRecipeSaved: function (event) {
            var vm = this;
            vm.fetchTechCards(false);

            
            
            vm.$message({
                message: "Технологическая карта " + event.recipe.Name + " успешно добавлена",
                type: 'success'
            });
            this.showAddRecipeDialog = false;
        }
    },

    watch: {
        isArchive: function (value) {
            this.fetchTechCards();
        },

        searchString: function (value) {
            if (!value) {
                clearTimeout(this.fetchTechCards);
                this.fetchTechCards();
            } else if (value.length >= 3) {
                clearTimeout(this.fetchTechCards);
                setTimeout(this.fetchTechCards, 300, { toFirstPage : true});
            }
        }
    },

    created: function () {
        var vm = this;
        vm.fetchTechCards(false);
    }
});