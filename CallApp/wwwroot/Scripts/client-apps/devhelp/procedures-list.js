Vue.component("procedures-list", {
    template: "#procedures-list",
    data: function () {
        return {
            procedures: [],
            currentProcedure: null
        };
    },

    computed: {
        currentProcedureName: {

            get: function () {
                if (this.currentProcedure) {
                    return this.currentProcedure.name;
                }
                return "NoName"
            },

            set: function (value) {
                this.currentProcedure = value;
            }
        }
    },

    methods: {
        executeProcedure: function (procedure) {
            console.log(procedure);
            procedure.isLoading = true;
            var vm = this;
            var parameters = {};
            procedure.parameters.forEach(function(item){
                parameters[item.name] = item.value;
            });
            $.ajax({
                method: "post",
                url: "/devhelp/" + procedure.name,
                data: parameters,
                success: function (data) {
                    //vm.procedures = data;
                    //vm.procedures.forEach(function (item, index) {
                    //    item.isLoading = false;
                    //});
                    //vm.currentProcedure = data[0];
                    procedure.isLoading = false;
                    vm.$alert("Процедура успешно выполнена", procedure.name, {
                        type: "success",
                        confirmButtonText: 'OK',
                    });
                },
                error: function (data) {

                }
            });

        }
    },

    created: function () {
        var vm = this;
        $.ajax({
            method: "get",
            url: "/devhelp/GetStoredProcedures",
            success: function (data) {
                vm.procedures = data;
                vm.procedures.forEach(function (item, index) {
                    item.isLoading = false;
                });
                vm.currentProcedure = data[0];
            }
        });
    }
});