Vue.component("documents-list", {
    template: "#documents-list",
    mixins: [crossdMixins],
    data: function () {
        return {
            filesList: []
        };
    },

    methods: {
        submitUpload: function() {
            this.$refs.upload.submit();
        },

        handleChange: function(file, filesList) {
            this.filesList = filesList.slice(-3);
        },

        handleRemove: function (file, fileList) {
            console.log(file, fileList);
        },
    }
});