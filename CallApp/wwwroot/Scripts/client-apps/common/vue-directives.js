Vue.directive('price',
    {

        //bind: function (el, binding, vnode) {
        //    // Переключаем фокус на элемент
        //    console.log("bind");
        //    console.log(el);
        //    console.log(binding);
        //    console.log(vnode);
        //    //console.log(binding.data);
        //    //vnode.data.model.value = -vnode.data.model.value;
        //    binding.value = -1 * binding.value;
        //},
        inserted: function(el, binding, vnode) {
            // Переключаем фокус на элемент
            console.log("insert");
            console.log(el);
            console.log(binding);
            console.log(vnode);
            //console.log(binding.data);
            //vnode.data.model.value = -vnode.data.model.value;
            //binding.value = -1 * binding.value;
        },

        update: function(el, binding, vnode, oldvnode) {
            console.log("update");
            console.log(el);
            console.log(binding);
            console.log(vnode);
            console.log(oldvnode);
            //el.data.model[] = Number.parseFloat((""+ )
            //console.log(binding.data);
            //vnode.data.model.value = -vnode.data.model.value;
            // binding.value = -1 * binding.value;
        },

        componentUpdated: function(el, binding, vnode, oldvnode) {
            console.log("componentUpdated");
            console.log(el);
            console.log(binding);
            console.log(vnode);
            console.log(oldvnode);
            //console.log(binding.data);
            //vnode.data.model.value = -vnode.data.model.value;
            //binding.value = -1 * binding.value;
        },
    });

Vue.directive('focus',
    {
        inserted: function(el) {
            el.focus();
        }
    })