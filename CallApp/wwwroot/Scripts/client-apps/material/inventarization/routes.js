
var documentsList = { template: "<inventarization-view></inventarization-view>" };

var routes = [
    {
        path: "",
        component: documentsList,
        name: "inventariztion",
        props: true,

    },
];

var router = new VueRouter({
    routes: routes,
    mode: "history",
    base: "/inventarization/"
});