var requestApp = { template: "<rep-request-app></rep-request-app>" };
var requestcard = { template: "<rep-request-card></rep-request-card>" };
var requestlist = {template: "<repair-request-list></repair-request-list>"}

var routes = [
    {
        path: "/",
		component: requestApp,
    	props: true,

    },
	{
        path: "/oid-:ObjectID",
        name: "requestlist",
        component: requestlist,
        props: true,
        children: [
            {
                path: "/oid-:ObjectID/new",
                component: requestlist,
                name: "requestlistnew"
            },
            {
                path: "/oid-:ObjectID/all",
                component: requestlist,
                name: "requestlistall"
            },
            {
                path: "/oid-:ObjectID/reg",
                component: requestlist,
                name: "requestlistreg"
            },
            {
                path: "/oid-:ObjectID/file",
                component: requestlist,
                name: "requestlistfile"
            },
        

        ]

    },
    {
        path: "/rid-:RequestID",
        name: "requestcard",
        component: requestcard,
        props: true,
    }
];

var router = new VueRouter({
	routes: routes,
	mode: "history",
	base: "/Repair/Requests/"
});