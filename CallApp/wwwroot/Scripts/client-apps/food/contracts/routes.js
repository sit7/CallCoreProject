
var contragentsList = { template: "<contragents-list></contragents-list>" };
var contractsList = { template: "<contracts-list></contracts-list>" };
var contractView = { template: "<contract-view></contract-view>" };

var routes = [
    {
        path: "/",
        component: contragentsList,
        name: "counteragents",
        props: true,
        //children: [
        //    {
        //        path: "article-:articleId",
        //        name: "articleRecipies",
        //        component: recipiesList,
        //        props : true

        //    }
        //]
    },
    {
        path: "/counteragent-:counteragentId",
        //name: "contracts",
        //component: "<router-view></router-view>",
        name: "contracts",
        component: contractsList,
        props: true,
        //beforeEnter: function (to, from, next) {
        //    console.log("route-enter");
        //    var date = new Date(Date.now()).toISOString();
        //    $.ajax({
        //        method: "get",
        //        url: "/contracts/counteragent-" + to.params.counteragentId,
        //        data: { year: date },
        //        success: function (data, status, xhr) {
        //            console.log("route-enter");
        //            console.log(data);
        //            next(function (vm) {
        //                console.log(vm);
        //                console.log("route-enter");
        //                console.log(data);
        //                vm.counteragent = data;
        //            });
        //        },
        //    });
        //},
    },
    {
        path: "/contract-:contractId",
        name: "contract",
        component: contractView,
        props: true,
    }
];

var router = new VueRouter({
    routes: routes,
    mode: "history",
    base: "/fooContract/ContractsNew/",


});
router.afterEach(function (to, from) {
    var contractsLink = document.querySelector("a.vue.contracts");
    contractsLink.href = "/fooContract/ContractsNew";
});
