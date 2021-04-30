Vue.component("rep-request-form", {

    template: "#rep-request-form",

    data: function () {
        var vm = this;
        var model = requests();
        return {
            requestmodel: model,
            requestcredentials: model.createcredentials(this.userinfo) 
    }
    },
    computed: {
        isreadonly: function() {
            return this.userinfo.isrepair && (this.request.RegDate !== null && this.request.RegDate !== undefined);
        }
    },

    props: {
        userinfo: { type: Object, required: true },
        request: {type: Object, required: true }
    },

    created: function () {
        
    },
    mounted: function () {


    },

    
    methods: {
        onsuccessupdate: function(response, status, xhr) {
            if (response.success) {
                this.$message({ offset: 100, message: 'Заявка обновлена', type: 'success' });
            } else {
                this.$message({ offset: 100, message: 'При обновлении заявки произошла ошибка', type: 'warning' });
            }
        },
        onerrorupdate: function(xhr, status, error) {
            this.$message({ offset: 100, message: error, type: 'error' });
        },
        updateRequest: function (e) {
            $.ajax({
                url: this.requestmodel.updatemethod,
                dataType: 'json',
                method: 'post',
                data: JSON.stringify(this.request),
                success: this.onsuccessupdate,
                error: this.onerrorupdate,
            });
        },

    }
})