Vue.component('repair-request-card', {
    template: '#repair-request-card',
    data: function () {
        var vm = this;
        var model = requestModel({ RequestID: vm.RequestID });
        return {
            cardmodel: model,
        };
    }


})