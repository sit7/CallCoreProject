Vue.component('counters-app',
    {
        template: '#counters-app',
        data: function() {
            return {
                model: countersmodel(),
            };
        },
        mixins: [jsonmixins],
        computed: {
            newobject: function() {
                return {
                    
                }
            }
        },
        methods: {
            // не знаю как это работает, но передать сгенеренный 
            // json из cshtml в компонент иначе не получается
            getuserinfo: function (value) {
                return value;
            }
        }
    })