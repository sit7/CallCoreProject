Vue.component('crossd-generic-file', {
    data: function () {
        var vm = this;
        return {
            src: 'data:' + vm.info.Mime + ';base64,' + vm.info.Image,
            imgwidth: 150,
            visible: true,
            tooltip: vm.info.Description || vm.info.FileName,
        };
    },

    template: '#crossd-generic-file',

    methods: {
        onedit: function () {
            this.$emit('file-edit', this, this.info);
        },
        ondownload: function () {
            this.$emit('file-download', this, this.info);
        },
        ondelete: function () {
            this.$emit('file-delete', this, this.info);
        },
        onview: function () {
            this.$emit('file-view', this, this.info);
        },
    },
    props: {
        info: {
            type: Object, required: true
        }
    }
})