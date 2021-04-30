Vue.component('objects-app',
    {
        template: '#objects-app',
        data: function () {
          

            return {
              

            };
        },
        props: {
            userinfo: {
                type: Object, default: function() {
                    return {};
                }
            }

        },

        methods: {
            getjson: (v) => v    
        }
    })