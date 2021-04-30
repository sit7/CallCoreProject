var callsspList = { template: "<callssp-list></callssp-list>" };

var routes = [
    {
    	path: "",
		name: "callsspList",
        component: callsspList,
    	props: true,

    },
];

var router = new VueRouter({
	routes: routes,
	mode: "history",
	base: "/Call/CallsspList"
}
 
);