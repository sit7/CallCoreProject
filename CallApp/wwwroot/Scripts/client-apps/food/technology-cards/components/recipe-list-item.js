Vue.component("recipe-list-item", {
    template: "#recipe-list-item",
    data: function () {
        return {
            //recipies: [],
            recipeContent: []
        };
    },
    props: {
        recipe: Object,
        techCardGroups: Array,
        isMini: {
            type: Boolean,
            default: false
        }
    },

    computed:{
        isArciveClass: function () {
            return {
                "is-archive": this.recipe.IsArchive > 0
            }
        },

        techCardReportLink: function () {
            //window.location.assign("/Food/TechnologyCardReport/" + this.recipe.RecipeID, '_blank');
            //window.open(location.host + "/Food/TechnologyCardReport/" + this.recipe.RecipeID, '_blank');
            return "/Food/TechnologyCardReport/" + this.recipe.RecipeID;
        }
    },

    methods: {
        loadRecipeContent: function () {
            console.log(this.recipe);
            var vm = this;
            $.ajax({
                method: "get",
                url: "/fooRecipe/GetRecipeContents2/" + vm.recipe.RecipeID,
                success: function (responce) {
                    vm.recipeContent = JSON.parse(responce).Foods;
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
                            message: "Технологическая карта "+vm.recipe.Name + " успешно перемещена",
                            type: 'success'
                        });
                    }
                }
            });
        },

        moveToArchive: function(recipeID){
            var vm = this;
            $.ajax({
                method: "post",
                url: "/fooRecipe/SetRecipeArchiveState",
                data: { recipeID: recipeID },
                success: function (response) {
                    if (response) {
                        vm.recipe.IsArchive = vm.recipe.IsArchive === 1 ? 0 : 1;
                        vm.$message({
                            message: "Технологическая карта " + vm.recipe.Name + " успешно перемещена",
                            type: 'warning'
                        });
                    }
                }
            });
        }
    },

    watch: {

    },

    created: function () {

    }
});