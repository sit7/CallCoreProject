Vue.component("contract-invoices", {
    template: "#contract-invoices",
    mixins: [crossdMixins],
    data: function () {
        return {

        };
    },

    props: {
        invoices: Array,
        height: Number,
        maxHeight: Number
    }
});