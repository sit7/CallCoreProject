Vue.component("rep-request-card", {
    template: "#rep-request-card",
    data: function () {

        return {
            request: null,
        };
    },
    computed: {
        loaded: function() {
            return this.request != null;
        },
        args: function() {
            return { Key: +this.$route.params.RequestID };
        },
		 requestReportLink: function () {
		 	return "/repRequest/RequestFormReport/" + this.$route.params.RequestID;
        },
    },
  
    props: {

    },
    mounted: function () {
        $.ajax({
            url: '/Repair/GetRequest',
            method: 'post',
            dataType: 'json',
            data: JSON.stringify(this.args),
            success: this.onsuccess,
            error: function (xhr, status, error) {

            }
        });
    },
    methods: {
        goback: function () {
            this.$router.go(-1);
        },

        updateRequest: function (req) {
            this.request = req;
        },
        getjson: function(obj) {
            return obj;
        },

        onsuccess: function (response) {
            if (response.success) {
                this.request = response.data;
            } else {
                console.error(response.message);
            }
        },
    },
    created: function () {
    }


})