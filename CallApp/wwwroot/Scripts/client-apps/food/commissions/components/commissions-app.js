Vue.component("commissions-app", {
    template: "#commissions-app",
    mixins:[crossdMixins],
    data: function () {
        return {
            hello: "hello",
            showFormDialog: false,
            commissions: [],
            commissionType: 0,
            membersToEdit: []
        }
    },

    methods: {
        loadCommissions: function () {
            var vm = this;
            $.ajax({
                method: "get",
                url: "/fooCommissions/GetObjectCommissions",
                success: function (data) {
                    vm.commissions = data;
                }
            });
        },

        edit: function (commission) {
            this.showFormDialog = true,
            this.commissionType = commission.CommissionTypeID;
            this.membersToEdit = this.cloneData(commission.members);
        },
        
        commissionSaved: function () {
            this.showFormDialog = false;
            this.loadCommissions();
        }
    },
    
    created: function () {
        var vm = this;
        vm.loadCommissions();
    }
});