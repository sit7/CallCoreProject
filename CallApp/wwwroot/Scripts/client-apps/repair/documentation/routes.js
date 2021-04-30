var documentationApp = { template: '<documentation-app></documentation-app>' }
var constructionProjectList = { template: '<construction-project-list></construction-project-list>' }
var albumlist = { template: '<project-album-list></project-album-list>' }

var routes = [
    {
        path: '/',
        component: documentationApp,
        props: true,
    },
    {
        path: '/Index',
        component: constructionProjectList,
        props: true
    }
];

var router = new VueRouter({
    routes: routes,
    mode: 'history',
    base: '/RepDocumentation/'
})