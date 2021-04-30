var callsList = { template: "<calls-list></calls-list>" };

var routes = [
    {
    	path: "",
		name: "callsList",
    	component: callsList,
    	props: true,

    },
];

var router = new VueRouter({
	routes: routes,
	mode: "history",
	base: "/Call/CallsList"
}
 
);