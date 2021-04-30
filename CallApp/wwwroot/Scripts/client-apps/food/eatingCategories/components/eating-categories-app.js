Vue.component("eating-categories-app", {
    template: "#eating-categories-app",
    mixins:[crossdMixins],
    data: function () {
        return {
            hello: "hello",
            showFormDialog: false,
            eatingCategories: [],
            eatingTimes: [],
            eatingTimeToEdit: null
        }
    },
    computed: {
        eatingCategoriesToAdd: function () {
            var vm = this;
            var result = vm.eatingCategories.filter(function (item) {
                
                return true;
                return vm.eatingTimes.some(function (time) {
                    return time.EatingCategoryID === item.EatingCategoryID;
                });
            });
            return result;
        },
        filledEatingTimes: function () {

        }
    },
    
    methods: {
        addNewEatingTime: function () {
            this.eatingTimeToEdit = this.cloneData({
                EatingCategoryID: null,
                hours: []
            });
            this.showFormDialog = true;
        },
        
        getEatingCategories: function () {
            var vm = this;
            $.ajax({
                method: "get",
                url: "/fooEatingTime/GetEatingCategories",
                success: function (response) {
                    vm.eatingCategories = response;
                }
            });
        },
        
        getObjectEatingTimes: function () {
            var vm = this;
            $.ajax({
                method: "get",
                url: "/fooEatingTime/GetObjectEatingTimes",
                success: function (response) {
                    console.log(response);
                    vm.eatingTimes = response;
                }
            });
        },
        
        editEatingTime: function (item) {

            this.eatingTimeToEdit = item;
            this.showFormDialog = true;
        },

        onEatingTimesSaved: function (data) {
            //var index = this.eatingTimes.findIndex(function (item) {
            //    return item.EatingCategoryID === data.EatingCategoryID
            //});


            //if (index > -1) {
            //    this.$set(this.eatingTimes, index, data);
            //} else {
            //    this.eatingTimes.push(data);
            //}
            this.getObjectEatingTimes();
            this.showFormDialog = false;
        }
    },

    created: function () {
        this.getEatingCategories();
        this.getObjectEatingTimes()
    }
});