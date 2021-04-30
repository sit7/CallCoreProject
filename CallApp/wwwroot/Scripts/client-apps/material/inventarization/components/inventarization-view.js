Vue.component("inventarization-view", {
    template: "#inventarization-view",
    mixins: [crossdMixins],
    data: function () {
        return {
            filesList: [],
            model: {
                date: new Date(Date.now()).toISOString()
            }
        };
    },
    computed: {
        isoDate: function () {
            return this.model.isoDate;
        },

        inventarizationLink: function () {
            return "/inventarization/list-" + new Date(Date.now()).toISOString();
        }
    },

    methods: {
        submitUpload: function () {
            this.$refs.upload.submit();
        },

        handleChange: function (file, filesList) {
            this.filesList = filesList.slice(-3);
        },

        handleRemove: function (file, fileList) {
            console.log(file, fileList);
        },

        getInventarizationList: function () {
            //$.ajax({
            //    method: "get",
            //    url: "/inventarization/list-" + new Date(Date.now()).toISOString()
            //});
            var form = document.forms["inventarizationList"];
            form.action = "/inventarization/list-" + new Date(this.model.date).toISOString();
            form.submit();
        },
    }
});