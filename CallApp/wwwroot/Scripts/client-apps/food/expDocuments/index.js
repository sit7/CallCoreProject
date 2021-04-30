ELEMENT.locale(ELEMENT.lang.ruRU);
//Vue.locale('ru-RU', ELEMENT.lang.ruRU);
//Vue.use(VueRouter);

//Vue.prototype.$vuescrollConfig = {
//    mode: 'native',
//    bar: {
//        background: '#c1c1c1',
//        onlyShowBarOnScroll: false,
//        keepShow: true,
//    }
//};
moment.locale("ru");

new Vue({
    el: "#app",
    //template: "#expDocumentCardView",
    mounted: function () {
       
    },
    store: store
});