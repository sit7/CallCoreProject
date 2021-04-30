var commissionsApp = { template: "<commissions-app></commissions-app>" };


var routes = [
    {
        path: "",
        component: commissionsApp,
        props: true,

    },

];

var router = new VueRouter({
    routes: routes,
    mode: "history",
    base: "/fooCommissions/CommissionsList/"
});