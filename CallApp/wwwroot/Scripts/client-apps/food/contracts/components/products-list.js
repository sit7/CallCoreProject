Vue.component("products-list", {
    template: "#products-list",
    mixins: [crossdMixins],
    data: function () {
        return {

        };
    },

    props: {
        products: Array,
        height: Number,
        maxHeight: Number
    }
});