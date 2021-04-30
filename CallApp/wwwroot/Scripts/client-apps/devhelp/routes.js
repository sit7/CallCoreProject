var proceduresList = { template: "<procedures-list></procedures-list>" };

var routes = [
    {
        path: "",
        component: proceduresList,
    },
];

var router = new VueRouter({
    routes: routes,
    mode: "history",
    base: "/DevHelp/StoredProceduresList/"
});