ELEMENT.locale(ELEMENT.lang.ruRU);
//Vue.locale('ru-RU', ELEMENT.lang.ruRU);
Vue.use(VueRouter);

Vue.prototype.$vuescrollConfig = {
    mode: 'native',
    bar: {
        background: '#c1c1c1',
        onlyShowBarOnScroll: false,
        keepShow: true,
    }
};

new Vue({
    el: "#app",
    template: "#mainView",
    router: router,
});