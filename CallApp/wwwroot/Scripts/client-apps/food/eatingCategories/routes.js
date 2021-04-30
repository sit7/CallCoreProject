var eatingCategoriesApp = { template: "<eating-categories-app></eating-categories-app>" };


var routes = [
    {
        path: "",
        component: eatingCategoriesApp,
        props: true,

    },

];

var router = new VueRouter({
    routes: routes,
    mode: "history",
    base: "/fooEatingTime/EatingTimeList/"
});