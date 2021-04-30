var technologyCardsApp = { template: "<technology-cards-app></technology-cards-app>" };
var recipiesList = { template: "<recipies-list></recipies-list>" };
var technologyCardView = { template: "<technology-card-view></technology-card-view>" };

var routes = [
    {
        path: "",
        component: technologyCardsApp,
        props: true,

    },
    {
        path: "/tech-card-:cardId",
        name: "techCardView",
        component: technologyCardView,
        props: true
    },
    {
        path: "/recipe-category-:categoryId",
        name: "recipeCategory",
        component: recipiesList,
        props:true
    }
];

var router = new VueRouter({
    routes: routes,
    mode: "history",
    base: "/Food/RecipeTreeNew/"
});