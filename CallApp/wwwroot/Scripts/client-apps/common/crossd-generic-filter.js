Vue.component('crossd-generic-filter',
    {
        template: '#crossd-generic-filter',
        data: function() {
            return {
                filterobject: this.payload
            }
        },

        methods: {
            emitFilterApply: function(event) {

            },
            resetFields: function(event) {

            }
        },
        props: {
            model: { required: true },
            creds: { required: true, type: Object },
            payload: { type: Object }
        }
    })