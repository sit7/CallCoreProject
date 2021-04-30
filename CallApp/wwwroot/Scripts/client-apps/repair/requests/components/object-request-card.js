Vue.component('object-request-card', {
    template: '#object-request-card',
    data: function () {
        var vm = this;
        return {
            objectRouteArgs: {
                name: 'requestlist',
                params: {
                    ObjectID: vm.group.ObjectID
                }
            },
            allReqRouteArgs: {
                name: 'requestlistall',
                params: {
                    ObjectID: vm.group.ObjectID,
                    Filter: 'all'
                }
            },
            newReqRouteArgs: {
                name: 'requestlistnew',
                params: {
                    ObjectID: vm.group.ObjectID,
                    Filter: 'new'
                }
            },
            regReqRouteArgs: {
                name: 'requestlistreg',
                params: {
                    ObjectID: vm.group.ObjectID,
                    Filter: 'reg'
                }
            },
            fileReqRouteArgs: {
                name: 'requestlistfile',
                params: {
                    ObjectID: vm.group.ObjectID,
                    Filter: 'file'
                }
            }
        }
    },
    props: {
        group: {type: Object, required: true}
    }
})