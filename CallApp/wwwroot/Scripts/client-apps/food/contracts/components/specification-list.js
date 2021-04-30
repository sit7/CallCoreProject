Vue.component("specification-list", {
    template: "#specification-list",
    mixins: [crossdMixins],
    data: function () {
        return {
          
        };
    },
    props: {
        contract: Object,
        showHeader: Boolean,
        showActions: Boolean,
        showContractSum: Boolean,
        editDetailMethod: Function,
        deleteDetailMethod: Function,
        cancelDeleteDetailMethod: Function
    },
    computed: {

    },

    methods: {

        getCellClass: function (item) {
            var columns = [];
            if (this.contract.IsVAT === 2) {
                columns = [1, 3, 4, 5, 6];
            }

            if (this.contract.IsVAT === 1) {
                columns = [1, 3, 4, 5, 6, 7, 8];
            }

            var cellClass = '';
            if (columns.some(function (column) { return item.columnIndex === column })) {
                cellClass += "text-right ";
            }
            return cellClass;
        }
 
    },


    created: function () {

    }

});