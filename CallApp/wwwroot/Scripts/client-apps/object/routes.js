var objectsApp = { template: "<objects-app></objects-app>" };
var objectCard = { template: "<object-card></object-card>" };

var routes = [
    {
        path: "",
        component: objectsApp,
        props: true,

    },
    {
        name: 'objectcard',
        path: '/:ObjectID',
        component: objectCard,
        props: true
    }
];

var router = new VueRouter({
    routes: routes,
    mode: "history",
    base: "/Object/GlobalObjects"
});