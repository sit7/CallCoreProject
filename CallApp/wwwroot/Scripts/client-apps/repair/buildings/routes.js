var buildingsApp = { template: '<buildings-app></buildings-app>' };
var objectbuilding = { template: '<buildings-list></buildings-list>' }
var summary = { template: '<building-summary></building-summary>' }


var routes = [
    {
    	path: '',
    	component: buildingsApp,
    	props: true,
    },
    {
        path: '/BuildingSummary',
        component: summary,
        props: true,
    },
	{
		path: '/:objectId',
		name: 'objectinfo',
		component: objectbuilding,
		props: true,
	
	},


];

var router = new VueRouter({
	routes: routes,
	mode: 'history',
	base: '/repBuilding'
});

