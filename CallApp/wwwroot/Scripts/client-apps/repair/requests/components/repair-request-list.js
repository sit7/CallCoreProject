Vue.component('repair-request-list', {
    template: '#repair-request-list',
    data: function () {
        //var o = {
        //    RequestCreator: 0,
        //    Value: null
        //}
        var vm = this;
        var routeparam = vm.$route.params;

        var modelobj = requestModel(vm.$route.params.ObjectID);
        var margs = modelobj.argmodel.args;
        if (routeparam.Filter !== undefined) {
            var f = routeparam.Filter;
            if (f === 'new') {
                margs.RequestStatusID = 1;
            } else if (f === 'reg') {
                margs.IsRegistered = true;
            } else if (f === 'file') {
                margs.HasFiles = true;
            }
        }
        return {

            model: modelobj,
            argmodel: modelobj.argmodel,
            args: margs
        }
    },
    methods: {
        onFilterApplied: function (dargs) {
            this.$refs["rrg"].loadData(dargs);
        },
    }
});