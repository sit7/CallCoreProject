
var documentsList = { template: "<documents-list></documents-list>" };

var routes = [
    {
        path: "",
        component: documentsList,
        name: "documents",
        props: true,

    },
];

var router = new VueRouter({
    routes: routes,
    mode: "history",
    base: "/upload/documents/"
});