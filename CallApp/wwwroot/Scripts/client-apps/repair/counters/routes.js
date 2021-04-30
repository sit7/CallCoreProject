var counterApp = { template: '<counters-app></counters-app>' }
var countersList = { template: '<counters-list></counters-list>' }
//var albumlist = { template: '<project-album-list></project-album-list>' }

var routes = [
    {
        path: '/',
        component: counterApp,
        props: true,
    },

];

var router = new VueRouter({
    routes: routes,
    mode: 'history',
    base: '/RepCounter/'
})