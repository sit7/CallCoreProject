Vue.component('object-card',
    {
        template: '#object-card',
        mixins: [objectsmixins],
        data: function () {
            
            return {
                currentobject: undefined,

            };
        },
        computed: {
            isreadonly: function() {
                return this.currentobject.ObjectStatusID === 3;
            },

            //cardmodel: function() {
            //    return objectcardmodel();
            //}

        },
        methods: {
            onsuccessget: function(response, status, xhr) {
                if (response.success) this.currentobject = response.data;
                else this.$message({ offset: 100, message: response.message, type: 'warning' });
            },
            onerrorget: function(xhr, status, error) {
                this.$message({ offset: 100, message: error, type: 'error' });
            },
            goback: function () {
                this.$router.go(-1);
            },
            getjson: function(obj) {
                return obj;
            }
        },
        mounted: function() {
            $.ajax({
                url: "/Object/GetObject",
                method: 'post',
                data: JSON.stringify(this.$route.params.ObjectID),
                //data: JSON.stringify({ Key: +this.$route.params.ObjectID }),
                dataType: 'json',
                success: this.onsuccessget,
                error: this.onerrorget
            });
        }
    });