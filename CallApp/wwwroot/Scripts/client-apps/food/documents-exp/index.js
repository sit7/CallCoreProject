ELEMENT.locale(ELEMENT.lang.ruRU);
//Vue.locale('ru-RU', ELEMENT.lang.ruRU);
Vue.use(VueRouter);

new Vue({
	el: "#app",
	template: "#mainView",
	router: router,
});