Vue.component("technology-card-form", {
    template: "#technology-card-form",
    mixins:[crossdMixins],
    data: function () {
        return {
            //recipies: [],
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
            formRecipe: {},
            
            chemicalGroups: ["Эн. ценость", "Витамины", "Минералы"],
            model: {},
            activeName: "recipe",
            recipeModel: {},
            product: null,
            validForms: [],
            recipeSources: [],
            nettoBeforeEdit: 0,
            isEditingActive: false
        };
    },

    props: {
        mode: String,
        recipe: Object,
        techCardGroups: Array,
        
    },

    computed: {
        canEditNetto: function () {
            console.log(this.mode);
            return (this.mode === "edit" && this.isEditingActive) || this.mode === "create";
        },

        productsModified: function () {
            return (this.mode === "edit" && this.isEditingActive) || (this.mode === "create");
        }
    },

    methods: {

        handleProductChanged: function (data) {
            console.log(data);
            this.recipeModel.fooFoodRecipe = data;
        },
        
        saveRecipe: function () {
            var validForms = []
            var vm = this;

            var recipe = this.recipeModel;
            this.$refs.formRecipe.validate(function (valid) {

                if (valid) {

                    if (!vm.recipeModel.fooFoodRecipe) {
                        vm.recipeModel.fooFoodRecipe = vm.recipeModel.Foods
                    }
                    if (vm.mode === "create") {
                        recipe.RecipeID = -1;
                    }
                    console.log(recipe);
                    $.ajax({
                        url: "/fooRecipe/SaveRecipe/",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        method: "post",
                        data: JSON.stringify({ recipe: recipe, foodsModified: vm.productsModified }),
                        success: function (response) {
                            console.log(response);
                            //if (response.success) {
                            //    //vm.$emit("close", { type: "edit", data: response.data });
                            //    //vm.$refs["model"].resetFields();
                            //    //vm.$message({
                            //    //    showClose: true,
                            //    //    message: "Сведения о договоре добавлены",
                            //    //    type: 'success'
                            //    //});
                            //} else {
                            //    vm.$alert(data, 'Ошибка', {
                            //        type: "error",
                            //        confirmButtonText: 'OK',
                            //    });
                            //}
                            var event = {
                                recipe: recipe,
                                newRecipeID: response,
                                mode: vm.mode
                            };

                            vm.$emit("form-saved", event);
                        }
                    });
                }
            });

        },

        getElementsByKindId: function (kindId) {
            return this.recipeModel.fooRecipeElement.filter(function (element) {
                return element.ElementKindID === kindId + 1
            })
        },

        getElementNameWithUnitMeasure: function (element) {
            return element.Name + ', ' + element.UnitMeasure;
        },

        productsTabEditing: function (data) {

            //this.$refs.nettoField.disabled = !data;
            this.isEditingActive = data;
            if (data) {
                this.nettoBeforeEdit = this.recipeModel.Netto;
            } else {
                this.recipeModel.Netto = this.nettoBeforeEdit;
                this.recipe.Foods = this.recipe.Foods.map(function (item) { return item;});
            }
        }
    },

    watch: {
        "recipe": function (value) {
            var vm = this;
            vm.recipeModel = vm.cloneData(vm.recipe);
        },
        
        "recipe.TechCardGroupID": function (value) {
            var vm = this;
            vm.recipeModel.TechCardGroupID = value;
        },
        
        "recipe.IsArchive": function (value) {
            var vm = this;
            vm.recipeModel.IsArchive = value;
        }
    },

    created: function () {
        var vm = this;
        vm.recipeModel = vm.cloneData(vm.recipe);
        console.log(vm.recipeModel);
        $.ajax({
            method: "get",
            url: "/fooRecipe/GetCookBooks",
            success: function (responce) {
                vm.recipeSources = responce
            }
        })
    },
});