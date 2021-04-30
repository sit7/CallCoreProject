var responsiblePersonsApp = { template: "<responsible-persons-app></responsible-persons-app>" };


var routes = [
    {
        path: "",
        component: responsiblePersonsApp,
        props: true,

    },

];

var router = new VueRouter({
    routes: routes,
    mode: "history",
    base: "/fooResponsiblePersons/List/"
});